# Gate 4: Performance Audit

**Task ID**: ${TASK_ID}  
**Task Name**: ${TASK_NAME}  
**Started**: ${TIMESTAMP}  
**Status**: IN PROGRESS

---

## Objective

Ensure changes don't negatively impact performance.

---

## Required Checklist

- [ ] **Bundle size impact measured**: Size delta documented
- [ ] **Lighthouse score > 90**: Performance score maintained
- [ ] **Load time < 3 seconds**: Page load time verified
- [ ] **No performance regressions**: Benchmark comparisons clean

---

## Bundle Size Analysis

**Before Changes**:
- Total bundle size: _____ KB
- Main bundle: _____ KB
- Vendor bundle: _____ KB

**After Changes**:
- Total bundle size: _____ KB
- Main bundle: _____ KB
- Vendor bundle: _____ KB

**Delta**: _____ KB (___%)

**Status**: [ ] ACCEPTABLE [ ] NEEDS OPTIMIZATION

---

## Lighthouse Score

**Test Date**: _______________  
**URL Tested**: _______________

| Metric | Before | After | Delta | Status |
|--------|--------|-------|-------|--------|
| Performance | | | | [ ] |
| Accessibility | | | | [ ] |
| Best Practices | | | | [ ] |
| SEO | | | | [ ] |

**Overall**: [ ] PASS (>90) [ ] FAIL (<90)

---

## Page Load Times

**Test Conditions**:
- Network: _______________
- Device: _______________
- Location: _______________

| Metric | Time | Target | Status |
|--------|------|--------|--------|
| TTFB | | <500ms | [ ] |
| FCP | | <1.5s | [ ] |
| LCP | | <2.5s | [ ] |
| TTI | | <3.0s | [ ] |

---

## Benchmark Comparisons

**Tool**: _______________

```
<!-- Paste benchmark results -->
```

**Regressions**: [ ] NONE [ ] DETECTED

---

## Optimization Recommendations

<!-- List any performance improvements identified -->

---

## Evidence

- Lighthouse report: _______________
- Benchmark logs: _______________
- Bundle analyzer: _______________

---

## Sign-off

- [ ] Performance acceptable
- [ ] No regressions detected
- [ ] Gate 4 complete

**Completed By**: _______________  
**Completion Date**: _______________
