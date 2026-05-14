# API Testing Checklist

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## LIST

| Section                     | Test Case                                                                    |
|-----------------------------|------------------------------------------------------------------------------|
| Permissions                 | Verify AUTHORISED users receive 200 OK                                       |
| Permissions                 | Verify UNAUTHORISED users receive 403 FORBIDDEN                              |
| Permissions                 | Verify UNAUTHENTICATED users receive 403 FORBIDDEN (or 401 where applicable) |
| Queryset / Returned Objects | Verify all expected objects are returned                                     |
| Queryset / Returned Objects | Verify excluded objects are not returned if queryset restrictions exist      |
| Queryset / Returned Objects | Verify filtered results match query parameters where applicable              |
| Queryset / Returned Objects | Verify empty queryset returns 200 OK with an empty list                      |
| Response Structure          | Verify expected fields are present                                           |
| Response Structure          | Verify unintended/private fields are absent                                  |
| Response Structure          | Verify response structure is consistent across returned objects              |
| Response Values             | Verify returned values match database records                                |
| Response Values             | Verify returned values are correctly serialised                              |

---

## CREATE

| Section       | Test Case                                                                          |
|----------------|------------------------------------------------------------------------------------|
| Permissions    | Verify AUTHORISED users can create object and receive 201 CREATED                  |
| Permissions    | Verify UNAUTHORISED users cannot create object and receive 403 FORBIDDEN           |
| Permissions    | Verify UNAUTHENTICATED users cannot create object and receive 401 UNAUTHORIZED     |
| Payloads       | Verify valid payload creates object successfully                                   |
| Payloads       | Verify invalid payloads return 400 BAD REQUEST                                     |
| Payloads       | Verify missing required fields return 400 BAD REQUEST                              |
| Payloads       | Verify validation errors are included in the response body                         |
| Business Rules | Verify duplicate objects return 400 BAD REQUEST if duplicates are not allowed      |
| Business Rules | Verify default/generated fields are set correctly after creation                   |
| Business Rules | Verify relationships (FK/M2M) are correctly assigned                               |

---

## RETRIEVE (DETAIL)

| Section            | Test Case                                                                        |
|--------------------|----------------------------------------------------------------------------------------------------|
| Permissions        | Verify AUTHORISED users can retrieve the object and receive 200 OK                                 |
| Permissions        | Verify UNAUTHORISED users cannot retrieve the object and receive 403 FORBIDDEN where applicable    |
| Permissions        | Verify UNAUTHENTICATED users cannot retrieve the object and receive 403 FORBIDDEN where applicable |
| Permissions        | Verify PUBLIC users can retrieve the object and receive 200 OK where the endpoint is public        |
| Object Lookup      | Verify the correct object is returned when lookup values are valid                                 |
| Object Lookup      | Verify invalid primary lookup value returns 404 NOT FOUND                                          |
| Object Lookup      | Verify invalid secondary lookup value returns 404 NOT FOUND where applicable                       |
| Object Lookup      | Verify mismatched lookup values return 404 NOT FOUND where multiple lookup values are required     |
| Response Structure | Verify expected fields are present                                                                 |
| Response Structure | Verify unintended/private fields are absent                                                        |
| Response Structure | Verify response structure is correct                                                               |
| Response Values    | Verify returned values match database records                                                      |
| Response Values    | Verify returned values are correctly serialised                                                    |

---

## UPDATE (PUT / PATCH)

| Section       | Test Case                                                                          |
|----------------|------------------------------------------------------------------------------------|
| Permissions    | Verify AUTHORISED users can update the object and receive 200 OK                   |
| Permissions    | Verify UNAUTHORISED users cannot update the object and receive 403 FORBIDDEN       |
| Permissions    | Verify UNAUTHENTICATED users cannot update the object and receive 403 FORBIDDEN    |
| Payloads       | Verify valid payload updates the object successfully                               |
| Payloads       | Verify invalid payload returns 400 BAD REQUEST                                     |
| Payloads       | Verify missing required fields return 400 BAD REQUEST where full update is required |
| Payloads       | Verify validation errors are included in the response body                         |
| Business Rules | Verify read-only fields cannot be changed                                          |
| Business Rules | Verify protected objects enforce update restrictions where applicable              |
| Business Rules | Verify unprotected objects allow updates where applicable                          |
| Business Rules | Verify only allowed fields can be updated where partial restrictions exist         |
| Business Rules | Verify unchanged fields remain unchanged when restricted updates are applied        |

---

## DELETE

| Section       | Test Case                                                                          |
|----------------|------------------------------------------------------------------------------------|
| Permissions    | Verify AUTHORISED users can delete the object and receive 204 NO CONTENT           |
| Permissions    | Verify UNAUTHORISED users cannot delete the object and receive 403 FORBIDDEN       |
| Permissions    | Verify UNAUTHENTICATED users cannot delete the object and receive 403 FORBIDDEN    |
| Business Rules | Verify protected objects cannot be deleted and return 403 FORBIDDEN where applicable |
| Business Rules | Verify unprotected objects can be deleted successfully                             |
| Business Rules | Verify deleted objects are removed from the database                               |
| Business Rules | Verify failed deletions do not remove the object from the database                 |

---

## EDGE CASES (GENERAL)

| Section | Test Case                                                     |
|---------|---------------------------------------------------------------|
| General | Verify behaviour when database is empty                       |
| General | Verify behaviour with large datasets                          |
| General | Verify behaviour with unexpected input types                  |
| General | Verify behaviour when related objects are missing             |
| General | Verify caching behaviour where applicable                     |
| General | Verify rate limiting or throttling where implemented          |

---

## SIGNALS (IF USED)

| Section | Test Case                                                                    |
|---------|------------------------------------------------------------------------------|
| Signals | Verify signals trigger on object creation                                    |
| Signals | Verify signals trigger on object update                                      |
| Signals | Verify signals trigger on object deletion                                    |
| Signals | Verify signals do not trigger when operations fail                           |
| Signals | Verify side effects (e.g. related object updates, logging, notifications)    |
