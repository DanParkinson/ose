# Manual Testing
## Subject API
---
# Subject List / Create Endpoint
**URL:** `/subjects/`

### List - Permissions
- Verify public user can access subject list
- Verify authenticated user can access subject list
- Verify admin user can access subject list

### List - Queryset / Returned Objects
- Verify all created subjects are returned
- Verify empty subject list returns no results

### List - Response Structure
- Verify all expected fields are present in each subject object
- Verify response structure is consistent across returned subjects

### List - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Create - Permissions
- Verify admin can create subject
- Verify authenticated non-admin cannot create subject
- Verify unauthenticated user cannot create subject

### Create - Payloads
- Verify valid payload creates subject successfully
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors

### Create - Business Rules
- Verify duplicate subject creation is blocked
- Verify slug is auto-generated correctly after creation

---

# Subject Detail / Update / Delete Endpoint
**URL:** `/subjects/<subject_slug>/<subject_id>/`

### Retrieve - Permissions
- Verify public user can access subject detail

### Retrieve - Object Lookup
- Verify valid slug and ID return correct subject
- Verify invalid subject ID returns not found
- Verify invalid subject slug returns not found
- Verify mismatched slug and ID returns not found

### Retrieve - Response Structure
- Verify all expected fields are present
- Verify response structure is correct

### Retrieve - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Update - Permissions
- Verify admin can update subject
- Verify authenticated non-admin cannot update subject
- Verify unauthenticated user cannot update subject

### Update - Payloads
- Verify valid payload updates non-protected subject
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors

### Update - Business Rules
- Verify slug cannot be changed
- Verify subject_id cannot be changed
- Verify protected subject only allows `is_protected` update
- Verify protected subject ignores changes to restricted fields
- Verify non-protected subject allows writable field updates

### Delete - Permissions
- Verify admin can delete non-protected subject
- Verify authenticated non-admin cannot delete subject
- Verify unauthenticated user cannot delete subject

### Delete - Business Rules
- Verify protected subject cannot be deleted
- Verify non-protected subject can be deleted
- Verify deleted subject is removed from database
- Verify failed protected deletion leaves subject intact

## Topic API
---
# Topic List / Create Endpoint
**URL:** `/topics/`

### List - Permissions
- Verify admin user can access topic list
- Verify authenticated non-admin cannot access topic list
- Verify unauthenticated user cannot access topic list

### List - Queryset / Returned Objects
- Verify all created topics are returned
- Verify empty topic list returns no results

### List - Response Structure
- Verify all expected fields are present in each topic object
- Verify response structure is consistent across returned topics

### List - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Create - Permissions
- Verify admin can create topic
- Verify authenticated non-admin cannot create topic
- Verify unauthenticated user cannot create topic

### Create - Payloads
- Verify valid payload creates topic successfully
- Verify valid payload assigns subject relationships correctly
- Verify valid payload can assign multiple subjects
- Verify create response returns correctly serialised topic data
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors

### Create - Business Rules
- Verify duplicate topic creation is blocked
- Verify duplicate validation is attached to `title`
- Verify slug is auto-generated correctly after creation

---

# Topic Detail / Update / Delete Endpoint
**URL:** `/topics/<topic_slug>/<topic_id>/`

### Retrieve - Permissions
- Verify admin user can access topic detail
- Verify authenticated non-admin cannot access topic detail
- Verify unauthenticated user cannot access topic detail

### Retrieve - Object Lookup
- Verify valid slug and ID return correct topic
- Verify invalid topic ID returns not found
- Verify invalid topic slug returns not found
- Verify mismatched slug and ID returns not found

### Retrieve - Response Structure
- Verify all expected fields are present
- Verify response structure is correct

### Retrieve - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Update - Permissions
- Verify admin can update topic
- Verify authenticated non-admin cannot update topic
- Verify unauthenticated user cannot update topic

### Update - Payloads
- Verify valid payload updates non-protected topic
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors for non-protected topic

### Update - Business Rules
- Verify slug cannot be changed
- Verify topic_id cannot be changed
- Verify protected topic only allows `is_protected` update
- Verify protected topic keeps restricted fields unchanged
- Verify non-protected topic allows full updates

### Delete - Permissions
- Verify admin can delete non-protected topic
- Verify authenticated non-admin cannot delete topic
- Verify unauthenticated user cannot delete topic

### Delete - Business Rules
- Verify protected topic cannot be deleted
- Verify non-protected topic can be deleted
- Verify deleted topic is removed from database
- Verify failed protected deletion leaves topic intact

## Lesson Name API
---
# Lesson Name List / Create Endpoint
**URL:** `/lesson-names/`

### List - Permissions
- Verify admin user can access lesson name list
- Verify authenticated non-admin cannot access lesson name list
- Verify unauthenticated user cannot access lesson name list

### List - Queryset / Returned Objects
- Verify all created lesson names are returned
- Verify empty lesson name list returns no results

### List - Response Structure
- Verify all expected fields are present in each lesson name object
- Verify response structure is consistent across returned lesson names

### List - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Create - Permissions
- Verify admin can create lesson name
- Verify authenticated non-admin cannot create lesson name
- Verify unauthenticated user cannot create lesson name

### Create - Payloads
- Verify valid payload creates lesson name successfully
- Verify valid payload assigns subject relationships correctly
- Verify valid payload can assign multiple subjects
- Verify create response returns correctly serialised lesson name data
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors

### Create - Business Rules
- Verify duplicate lesson name creation is blocked
- Verify duplicate validation is attached to `title`
- Verify slug is auto-generated correctly after creation

---

# Lesson Name Detail / Update / Delete Endpoint
**URL:** `/lesson-names/<lesson_name_slug>/<lesson_name_id>/`

### Retrieve - Permissions
- Verify admin user can access lesson name detail
- Verify authenticated non-admin cannot access lesson name detail
- Verify unauthenticated user cannot access lesson name detail

### Retrieve - Object Lookup
- Verify valid slug and ID return correct lesson name
- Verify invalid lesson name ID returns not found
- Verify invalid lesson name slug returns not found
- Verify mismatched slug and ID returns not found

### Retrieve - Response Structure
- Verify all expected fields are present
- Verify response structure is correct

### Retrieve - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Update - Permissions
- Verify admin can update lesson name
- Verify authenticated non-admin cannot update lesson name
- Verify unauthenticated user cannot update lesson name

### Update - Payloads
- Verify valid payload updates non-protected lesson name
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors for non-protected lesson name

### Update - Business Rules
- Verify slug cannot be changed
- Verify lesson_name_id cannot be changed
- Verify protected lesson name only allows `is_protected` update
- Verify protected lesson name keeps restricted fields unchanged
- Verify non-protected lesson name allows full updates

### Delete - Permissions
- Verify admin can delete non-protected lesson name
- Verify authenticated non-admin cannot delete lesson name
- Verify unauthenticated user cannot delete lesson name

### Delete - Business Rules
- Verify protected lesson name cannot be deleted
- Verify non-protected lesson name can be deleted
- Verify deleted lesson name is removed from database
- Verify failed protected deletion leaves lesson name intact

## Variation API
---
# Variation List / Create Endpoint
**URL:** `/variations/`

### List - Permissions
- Verify admin user can access variation list
- Verify authenticated non-admin cannot access variation list
- Verify unauthenticated user cannot access variation list

### List - Queryset / Returned Objects
- Verify all created variations are returned
- Verify empty variation list returns no results

### List - Response Structure
- Verify all expected fields are present in each variation object
- Verify response structure is consistent across returned variations

### List - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Create - Permissions
- Verify admin can create variation
- Verify authenticated non-admin cannot create variation
- Verify unauthenticated user cannot create variation

### Create - Payloads
- Verify valid payload creates variation successfully
- Verify create response returns correctly serialised variation data
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors

### Create - Business Rules
- Verify duplicate variation creation is blocked
- Verify duplicate validation is attached to `title`
- Verify slug is auto-generated correctly after creation

---

# Variation Detail / Update / Delete Endpoint
**URL:** `/variations/<variation_slug>/<variation_id>/`

### Retrieve - Permissions
- Verify admin user can access variation detail
- Verify authenticated non-admin cannot access variation detail
- Verify unauthenticated user cannot access variation detail

### Retrieve - Object Lookup
- Verify valid slug and ID return correct variation
- Verify invalid variation ID returns not found
- Verify invalid variation slug returns not found
- Verify mismatched slug and ID returns not found

### Retrieve - Response Structure
- Verify all expected fields are present
- Verify response structure is correct

### Retrieve - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Update - Permissions
- Verify admin can update variation
- Verify authenticated non-admin cannot update variation
- Verify unauthenticated user cannot update variation

### Update - Payloads
- Verify valid payload updates non-protected variation
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors for non-protected variation

### Update - Business Rules
- Verify slug cannot be changed
- Verify variation_id cannot be changed
- Verify protected variation only allows `is_protected` update
- Verify protected variation keeps restricted fields unchanged
- Verify non-protected variation allows full updates

### Delete - Permissions
- Verify admin can delete non-protected variation
- Verify authenticated non-admin cannot delete variation
- Verify unauthenticated user cannot delete variation

### Delete - Business Rules
- Verify protected variation cannot be deleted
- Verify non-protected variation can be deleted
- Verify deleted variation is removed from database
- Verify failed protected deletion leaves variation intact

## Teaching Style API
---
# Teaching Style List / Create Endpoint
**URL:** `/teaching_styles/`

### List - Permissions
- Verify admin user can access teaching style list
- Verify authenticated non-admin cannot access teaching style list
- Verify unauthenticated user cannot access teaching style list

### List - Queryset / Returned Objects
- Verify all created teaching styles are returned
- Verify empty teaching style list returns no results

### List - Response Structure
- Verify all expected fields are present in each teaching style object
- Verify response structure is consistent across returned teaching styles

### List - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Create - Permissions
- Verify admin can create teaching style
- Verify authenticated non-admin cannot create teaching style
- Verify unauthenticated user cannot create teaching style

### Create - Payloads
- Verify valid payload creates teaching style successfully
- Verify create response returns correctly serialised teaching style data
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors

### Create - Business Rules
- Verify duplicate teaching style creation is blocked
- Verify duplicate validation is attached to `title`
- Verify slug is auto-generated correctly after creation

---

# Teaching Style Detail / Update / Delete Endpoint
**URL:** `/teaching_styles/<teaching_style_slug>/<teaching_style_id>/`

### Retrieve - Permissions
- Verify admin user can access teaching style detail
- Verify authenticated non-admin cannot access teaching style detail
- Verify unauthenticated user cannot access teaching style detail

### Retrieve - Object Lookup
- Verify valid slug and ID return correct teaching style
- Verify invalid teaching style ID returns not found
- Verify invalid teaching style slug returns not found
- Verify mismatched slug and ID returns not found

### Retrieve - Response Structure
- Verify all expected fields are present
- Verify response structure is correct

### Retrieve - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Update - Permissions
- Verify admin can update teaching style
- Verify authenticated non-admin cannot update teaching style
- Verify unauthenticated user cannot update teaching style

### Update - Payloads
- Verify valid payload updates non-protected teaching style
- Verify invalid payload returns validation errors
- Verify missing required fields returns validation errors for non-protected teaching style

### Update - Business Rules
- Verify slug cannot be changed
- Verify teaching_style_id cannot be changed
- Verify protected teaching style only allows `is_protected` update
- Verify protected teaching style keeps restricted fields unchanged
- Verify non-protected teaching style allows full updates

### Delete - Permissions
- Verify admin can delete non-protected teaching style
- Verify authenticated non-admin cannot delete teaching style
- Verify unauthenticated user cannot delete teaching style

### Delete - Business Rules
- Verify protected teaching style cannot be deleted
- Verify non-protected teaching style can be deleted
- Verify deleted teaching style is removed from database
- Verify failed protected deletion leaves teaching style intact

## Resource API
---
# Resource List / Create Endpoint
**URL:** `/subjects/<subject_slug>/<subject_id>/resources/`

### List - Permissions
- Verify admin user can access resource list
- Verify authenticated non-admin cannot access resource list
- Verify unauthenticated user cannot access resource list

### List - Queryset / Returned Objects
- Verify all created resources linked to the subject are returned
- Verify resources linked to other subjects are not returned
- Verify empty resource list returns no results

### List - Response Structure
- Verify all expected fields are present in each resource object
- Verify response structure is consistent across returned resources

### List - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Create - Permissions
- Verify admin can create resource
- Verify authenticated non-admin cannot create resource
- Verify unauthenticated user cannot create resource

### Create - Payloads
- Verify valid payload creates resource successfully
- Verify created resource is linked to the subject from the URL
- Verify created resource author is set from the authenticated user
- Verify create response returns correctly serialised resource data
- Verify missing required fields returns validation errors

### Create - Business Rules
- Verify slug is auto-generated correctly after creation

---

# Resource Detail / Update / Delete Endpoint
**URL:** `/subjects/<subject_slug>/<subject_id>/resources/<resource_slug>/<resource_id>/`

### Retrieve - Permissions
- Verify admin user can access resource detail
- Verify authenticated non-admin cannot access resource detail
- Verify unauthenticated user cannot access resource detail

### Retrieve - Object Lookup
- Verify valid slug and ID return correct resource
- Verify invalid resource ID returns not found
- Verify invalid resource slug returns not found
- Verify mismatched slug and ID returns not found

### Retrieve - Response Structure
- Verify all expected fields are present
- Verify response structure is correct

### Retrieve - Response Values
- Verify returned values match database records
- Verify values are correctly serialised

### Update - Permissions
- Verify admin can update resource
- Verify authenticated non-admin cannot update resource
- Verify unauthenticated user cannot update resource

### Update - Payloads
- Verify valid payload updates non-protected resource
- Verify missing required fields returns validation errors for non-protected resource

### Update - Business Rules
- Verify slug cannot be changed
- Verify resource_id cannot be changed
- Verify author cannot be changed
- Verify protected resource only allows `is_protected` update
- Verify protected resource keeps restricted fields unchanged
- Verify non-protected resource allows full updates

### Delete - Permissions
- Verify admin can delete non-protected resource
- Verify authenticated non-admin cannot delete resource
- Verify unauthenticated user cannot delete resource

### Delete - Business Rules
- Verify protected resource cannot be deleted
- Verify non-protected resource can be deleted
- Verify deleted resource is removed from database
- Verify failed protected deletion leaves resource intact

## Lesson Variant API
---
# Lesson Variant List Endpoint
**URL:** `/subjects/<subject_slug>/<subject_id>/lessons/`

### List - Permissions
- Verify public user can access lesson variant list
- Verify authenticated user can access lesson variant list
- Verify admin user can access lesson variant list

### List - Object Lookup
- Verify valid subject slug and ID return lesson variants for that subject
- Verify invalid subject ID returns not found
- Verify invalid subject slug returns not found
- Verify mismatched subject slug and ID returns not found

### List - Queryset / Returned Objects
- Verify all lesson variants for the requested subject are returned
- Verify lesson variants for other subjects are not returned
- Verify empty lesson variant list returns no results

### List - Response Structure
- Verify all expected fields are present in each lesson variant object
- Verify response structure is consistent across returned lesson variants

### List - Response Values
- Verify returned values match database records
- Verify values are correctly serialised
- Verify related fields are returned as titles
- Verify author is returned as username



## Lesson Variant Create Endpoint
**URL:** `/subjects/<subject_slug>/<subject_id>/lessons/create/`

### Create - Permissions
- Verify admin can create lesson variant
- Verify authenticated non-admin cannot create lesson variant
- Verify unauthenticated user cannot create lesson variant

### Create - Subject Lookup
- Verify valid subject slug and ID allow creation
- Verify invalid subject ID returns not found
- Verify invalid subject slug returns not found
- Verify mismatched subject slug and ID returns not found

### Create - Payloads
- Verify valid payload creates lesson variant successfully
- Verify topic must belong to subject from URL
- Verify lesson name must belong to subject from URL
- Verify invalid related field values return validation errors
- Verify missing required fields return validation errors

### Create - Business Rules
- Verify subject is assigned from URL
- Verify author is assigned from authenticated user
- Verify slug is auto-generated correctly
- Verify duplicate lesson variant combinations are blocked

### Create - Response Structure
- Verify expected fields are returned after creation

### Create - Response Values
- Verify returned values match created database record

---

## Lesson Variant Detail / Update / Delete Endpoint
**URL:** `/subjects/<subject_slug>/<subject_id>/lessons/<lesson_variant_slug>/<lesson_variant_id>/`

### Retrieve - Permissions
- Verify public user can access lesson variant detail
- Verify authenticated user can access lesson variant detail
- Verify admin user can access lesson variant detail

### Retrieve - Object Lookup
- Verify valid subject slug, subject ID, lesson variant slug, and lesson variant ID return correct object
- Verify invalid subject ID returns not found
- Verify invalid subject slug returns not found
- Verify mismatched subject slug and ID returns not found
- Verify invalid lesson variant ID returns not found
- Verify invalid lesson variant slug returns not found
- Verify mismatched lesson variant slug and ID returns not found
- Verify lesson variant from another subject cannot be accessed through wrong subject URL

### Retrieve - Response Structure
- Verify all expected fields are present
- Verify response structure is correct

### Retrieve - Response Values
- Verify returned values match database records
- Verify related fields are correctly serialised
- Verify author is serialised as username

### Update - Permissions
- Verify admin can update unprotected lesson variant
- Verify authenticated non-admin cannot update lesson variant
- Verify unauthenticated user cannot update lesson variant

### Update - Payloads
- Verify valid payload updates unprotected lesson variant
- Verify invalid payload returns validation errors
- Verify missing required fields behave according to serializer rules

### Update - Business Rules
- Verify protected lesson variants cannot be updated
- Verify failed protected update leaves object unchanged

### Delete - Permissions
- Verify admin can delete unprotected lesson variant
- Verify authenticated non-admin cannot delete lesson variant
- Verify unauthenticated user cannot delete lesson variant

### Delete - Business Rules
- Verify protected lesson variants cannot be deleted
- Verify unprotected lesson variants can be deleted
- Verify deleted lesson variants are removed from database
- Verify failed protected deletion leaves object unchanged
