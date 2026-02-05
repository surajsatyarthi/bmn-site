#!/bin/bash

# Lightweight system health monitor for development tools

echo "--- System Health Check (Dev Tools) ---"
echo "Timestamp: $(date)"
echo ""

# Check CPU usage of top development processes
echo "Top 5 Resource Consuming Processes:"
ps auxww | sort -nrk 3 | head -n 5 | awk '{printf "%-10s %-10s %-5s %%CPU %-5s %%MEM %s\n", $1, $2, $3, $4, $11}'
echo ""

# Check memory pressure (macOS specific)
echo "Memory Stats:"
vm_stat | head -n 5
echo ""

# Check disk space in critical areas
echo "Disk Usage (Project Root):"
du -sh .
echo ""

echo "---------------------------------------"
