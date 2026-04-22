## API Testing Checklist

---

### LIST

#### Permissions
- Verify AUTHORISED users receive 200 OK
- Verify UNAUTHORISED users receive 403 FORBIDDEN
- Verify UNAUTHENTICATED users receive 403 FORBIDDEN (or 401 where applicable)

#### Queryset / Returned Objects
- Verify all expected objects are returned
- Verify excluded objects are not returned if queryset restrictions exist
- Verify filtered results match query parameters where applicable
- Verify empty queryset returns 200 OK with an empty list

#### Response Structure
- Verify expected fields are present
- Verify unintended/private fields are absent
- Verify response structure is consistent across returned objects

#### Response Values
- Verify returned values match database records
- Verify returned values are correctly serialised

---

### CREATE

#### Permissions
- Verify AUTHORISED users can create object and receive 201 CREATED
- Verify UNAUTHORISED users cannot create object and receive 403 FORBIDDEN
- Verify UNAUTHENTICATED users cannot create object and receive 401 UNAUTHORIZED

#### Payloads
- Verify valid payload creates object successfully
- Verify invalid payloads return 400 BAD REQUEST
- Verify missing required fields return 400 BAD REQUEST
- Verify validation errors are included in the response body

#### Business Rules
- Verify duplicate objects return 400 BAD REQUEST if duplicates are not allowed
- Verify default/generated fields are set correctly after creation
- Verify relationships (FK/M2M) are correctly assigned

---

### RETRIEVE (DETAIL)

#### Permissions
- Verify AUTHORISED users can retrieve the object and receive 200 OK
- Verify UNAUTHORISED users cannot retrieve the object and receive 403 FORBIDDEN where applicable
- Verify UNAUTHENTICATED users cannot retrieve the object and receive 403 FORBIDDEN where applicable
- Verify PUBLIC users can retrieve the object and receive 200 OK where the endpoint is public

#### Object Lookup
- Verify the correct object is returned when lookup values are valid
- Verify invalid primary lookup value returns 404 NOT FOUND
- Verify invalid secondary lookup value returns 404 NOT FOUND where applicable
- Verify mismatched lookup values return 404 NOT FOUND where multiple lookup values are required

#### Response Structure
- Verify expected fields are present
- Verify unintended/private fields are absent
- Verify response structure is correct

#### Response Values
- Verify returned values match database records
- Verify returned values are correctly serialised

---

### UPDATE (PUT / PATCH)

#### Permissions
- Verify AUTHORISED users can update the object and receive 200 OK
- Verify UNAUTHORISED users cannot update the object and receive 403 FORBIDDEN
- Verify UNAUTHENTICATED users cannot update the object and receive 403 FORBIDDEN

#### Payloads
- Verify valid payload updates the object successfully
- Verify invalid payload returns 400 BAD REQUEST
- Verify missing required fields return 400 BAD REQUEST where full update is required
- Verify validation errors are included in the response body

#### Business Rules
- Verify read-only fields cannot be changed
- Verify protected objects enforce update restrictions where applicable
- Verify unprotected objects allow updates where applicable
- Verify only allowed fields can be updated where partial restrictions exist
- Verify unchanged fields remain unchanged when restricted updates are applied

---

### DELETE

#### Permissions
- Verify AUTHORISED users can delete the object and receive 204 NO CONTENT
- Verify UNAUTHORISED users cannot delete the object and receive 403 FORBIDDEN
- Verify UNAUTHENTICATED users cannot delete the object and receive 403 FORBIDDEN

#### Business Rules
- Verify protected objects cannot be deleted and return 403 FORBIDDEN where applicable
- Verify unprotected objects can be deleted successfully
- Verify deleted objects are removed from the database
- Verify failed deletions do not remove the object from the database

---

### EDGE CASES (GENERAL)

- Verify behaviour when database is empty
- Verify behaviour with large datasets
- Verify behaviour with unexpected input types
- Verify behaviour when related objects are missing
- Verify caching behaviour where applicable
- Verify rate limiting or throttling where implemented

---

### SIGNALS (IF USED)

- Verify signals trigger on object creation
- Verify signals trigger on object update
- Verify signals trigger on object deletion
- Verify signals do not trigger when operations fail
- Verify side effects (e.g. related object updates, logging, notifications)

---
