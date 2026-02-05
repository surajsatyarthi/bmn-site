# Gate 3: Security Audit

**Task ID**: ${TASK_ID}  
**Task Name**: ${TASK_NAME}  
**Started**: ${TIMESTAMP}  
**Status**: IN PROGRESS

---

## Objective

Verify that all code changes are secure and free from vulnerabilities.

---

## Required Checklist

- [ ] **XSS vulnerability scan completed**: No script injection vulnerabilities
- [ ] **SQL injection tests passed**: All database queries parameterized
- [ ] **CSRF verification done**: CSRF tokens implemented where needed
- [ ] **Authentication/authorization reviewed**: Access controls verified
- [ ] **Input validation checked**: All user inputs sanitized

---

## Security Scan Results

### XSS (Cross-Site Scripting)

**Test Date**: _______________  
**Tools Used**: _______________

**Findings**:
<!-- Document any XSS vulnerabilities found -->

**Status**: [ ] PASS [ ] FAIL

---

### SQL Injection

**Test Date**: _______________  
**Tools Used**: _______________

**Findings**:
<!-- Document any SQL injection vulnerabilities -->

**Status**: [ ] PASS [ ] FAIL

---

### CSRF (Cross-Site Request Forgery)

**Test Date**: _______________

**Findings**:
<!-- Document CSRF protection status -->

**Status**: [ ] PASS [ ] FAIL

---

### Authentication & Authorization

**Areas Reviewed**:
- [ ] Login endpoints
- [ ] Protected routes
- [ ] API access controls
- [ ] Session management

**Findings**:
<!-- Document authentication/authorization issues -->

**Status**: [ ] PASS [ ] FAIL

---

### Input Validation

**Inputs Checked**:
- [ ] Form inputs
- [ ] URL parameters
- [ ] API payloads
- [ ] File uploads

**Findings**:
<!-- Document input validation issues -->

**Status**: [ ] PASS [ ] FAIL

---

## Overall Security Assessment

**Risk Level**: [ ] LOW [ ] MEDIUM [ ] HIGH  
**Blockers**: _______________

---

## Evidence

- Test results: _______________
- Screenshots: _______________
- Tool reports: _______________

---

## Sign-off

- [ ] Security engineer review completed
- [ ] All vulnerabilities addressed
- [ ] Gate 3 complete

**Completed By**: _______________  
**Completion Date**: _______________
