#!/bin/bash

# Antigravity Directory - Watchdog Supervisor
# Basis: Senior Systems Engineer Analysis (Watchdog Pattern)
# Targets RSS (Resident Set Size) leaks in opaque binaries.

LOG_FILE="/tmp/antigravity_watchdog.log"
MEM_LIMIT_MB=4096  # 4GB Threshold (Standard for 8GB system)
PID_FILE="/tmp/antigravity_watchdog.pid"

# --- 1. Collision Control (Flock equivalent) ---
if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    if ps -p $PID > /dev/null; then
        echo "$(date): Another watchdog instance is running (PID: $PID). Exiting." >> "$LOG_FILE"
        exit 1
    fi
fi
echo $$ > "$PID_FILE"

# --- 2. Safety Check: Prevent "Startup Storms" ---
# If the system has been up for less than 5 minutes, back off.
UPTIME_SEC=$(sysctl -n kern.boottime | awk -F'[= ,]' '{print $4}' | xargs -I{} bash -c "echo \$((\$(date +%s) - {}))")
if [ "$UPTIME_SEC" -lt 300 ]; then
    echo "$(date): [BACKOFF] System recently started ($UPTIME_SEC sec). Waiting for stability..." >> "$LOG_FILE"
    rm -f "$PID_FILE"
    exit 0
fi

echo "$(date): --- Starting Health Audit ---" >> "$LOG_FILE"

# --- 3. Memory Audit: Target Language Server ---
LSP_PIDS=$(pgrep -f "language_server_macos_x64")

for PID in $LSP_PIDS; do
    # Safety Check: How long has this specific process been running?
    # Don't kill anything that started less than 5 minutes ago (it's likely still indexing).
    PROC_START=$(ps -o etimes= -p "$PID" | tr -d ' ')
    if [ "$PROC_START" -lt 300 ]; then
        echo "$(date): [HEALTHY] Skipping young process (PID: $PID, Age: ${PROC_START}s) to allow indexing." >> "$LOG_FILE"
        continue
    fi

    RSS_KB=$(ps -o rss= -p "$PID" | tr -d ' ')
    RSS_MB=$((RSS_KB / 1024))
    
    if [ "$RSS_MB" -gt "$MEM_LIMIT_MB" ]; then
        # Double-check: Is it still high after 10 seconds? (Avoid spikes)
        sleep 10
        RSS_KB_RECHECK=$(ps -o rss= -p "$PID" | tr -d ' ')
        RSS_MB_RECHECK=$((RSS_KB_RECHECK / 1024))
        
        if [ "$RSS_MB_RECHECK" -gt "$MEM_LIMIT_MB" ]; then
            echo "$(date): [CRITICAL] Sustained leak detected (PID: $PID). Usage: ${RSS_MB_RECHECK}MB. Initiating reset..." >> "$LOG_FILE"
            kill -9 "$PID"
        fi
    else
        echo "$(date): [HEALTHY] LSP (PID: $PID) usage is ${RSS_MB}MB." >> "$LOG_FILE"
    fi
done

# --- 3. Cleanup Orphaned Development Servers ---
# Targets node processes over 2GB that have lost their parent process (PPID 1).
ORPHANED_NODE=$(ps -efj | awk '$3 == 1 && $8 ~ /node/ {print $2}')
for PID in $ORPHANED_NODE; do
    RSS_KB=$(ps -o rss= -p "$PID" | tr -d ' ')
    RSS_MB=$((RSS_KB / 1024))
    if [ "$RSS_MB" -gt 2048 ]; then
        echo "$(date): [CLEANUP] Terminating orphaned heavy node process (PID: $PID). Usage: ${RSS_MB}MB." >> "$LOG_FILE"
        kill -9 "$PID"
    fi
done

rm -f "$PID_FILE"
echo "$(date): --- Audit Complete ---" >> "$LOG_FILE"
