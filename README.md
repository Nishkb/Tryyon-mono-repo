# README

# Tryyon Mono Repo

This is a [Next.js](https://nextjs.org/) project bootstrapped with `[create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)`.

## Getting Started

First, run the development server:

```bash
npm run dev# oryarn dev
```

Open [http://localhost:3000](http://localhost:3000/) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

# Tryyon API Documentation

Built on Next.js and Prisma ORM.

## Admin Routes

-   **/api/admin/register**
    -   Unprotected route
    -   Accepted method - `POST`
    -   Body format -
        ```
        username: string, required, unique
        firstname: string, required
        lastname: string, required
        phone: number, 10-digit, required, unique
        email: string, email, required, unique
        password: string, required
        role: string
        ```
    -   Successful Response -
        ```
        {
            message: 'New admin registered',
            admin: {
               "id": "...",
               "username": "...",
               "firstname": "...",
               "lastname": "...",
               "phone": ...,
               "email": "...",
               "passwordHash": "...",
               "token": "...",
               "email_verified": "...",
               "verificationCode": "...",
               "verificationExpiry": "..."
               "roleId": "..."
            }
        }
        ```
-   **/api/admin/login**
    -   Unprotected route
    -   Accepted method - `POST`
    -   Body format -
        ```
        email: string, email, required, unique
        password: string, required
        ```
    -   Successful Response -
        ```
        {
            message: 'New admin registered',
            admin: {
               "id": "...",
               "username": "...",
               "firstname": "...",
               "lastname": "...",
               "phone": ...,
               "email": "...",
               "passwordHash": "...",
               "token": "...",
               "email_verified": "...",
               "verificationCode": "...",
               "verificationExpiry": "..."
               "roleId": "..."
            }
        }
        ```
-   **/api/admin/verify**
    -   Unprotected route
    -   Accepted method - `GET`
    -   Query format -
        ```
        ?code=<verification-code>
        ```
    -   Successful Response -
        ```
        {
            "message": "Admin verified",
            "verifiedAdmin": {
                "id": "...",
                "username": "...",
                "firstname": "...",
                "lastname": "...",
                "phone": ...,
                "email": "...",
                "passwordHash": "...",
                "token": "...",
                "email_verified": ...,
                "verificationCode": "...",
                "verificationExpiry": "...",
                "roleId": "...",
                "role": {
                    "id": "...",
                    "title": "...",
                    "adminRoles": [...],
                    "tenantRoles": [...]
                }
            }
        }
        ```
-   **/api/admin/check**
    -   Protected route - bearer token needed
    -   Accepted method - `GET`
    -   Successful Response -
        ```
        {
            "message": "Admin Authenticated",
            "admin": {
                "id": "...",
                "email": "...",
                "role": {
                    "id": "...",
                    "title": "...",
                    "adminRoles": [...],
                    "tenantRoles": [...]
                },
                "iat": 1656301662,
                "exp": 1656308862
            }
        }
        ```
-   **/api/admin/{{adminId}}**
    -   Protected route - bearer token needed
    -   Accepted method - `GET`
    -   Successful Response -
        ```
        {
            "message": "Admin found",
            "admin": {
                "id": "...",
                "username": "...",
                "firstname": "...",
                "lastname": "...",
                "phone": ...,
                "email": "...",
                "passwordHash": "...",
                "token": "...",
                "email_verified": ...,
                "verificationCode": "...",
                "verificationExpiry": "...",
                "roleId": "...",
                "role": {
                    "id": "...",
                    "title": "...",
                    "adminRoles": [...],
                    "tenantRoles": [...]
                }
            }
        }
        ```
-   **/api/admin/delete**
    -   Protected route - bearer token needed
    -   Accepted method - `DELETE`
    -   Body format -
        ```
        id: string, required
        ```
    -   Successful Response -
        ```
        {
          "message": "Admin deleted"
        }
        ```

## User Routes

-   Unprotected
    -   **/api/user/register**
        -   Unprotected route
        -   Accepted method - `POST`
        -   Body format -
            ```
            username: string, required, unique
            firstname: string, required
            lastname: string, required
            phone: number, 10-digit, required, unique
            email: string, email, required, unique
            password: string, required
            role: string
            ```
        -   Successful Response -
            ```
            {
              "message": "New user registered",
              "user": {
                "id": "62b92a56c18760f3a77c6fef",
                "username": "Raoul_MacGyver",
                "firstname": "Matilda",
                "lastname": "Schmidt",
                "phone": 7213503142,
                "email": "Esta.Schinner7@hotmail.com",
                "passwordHash": "...",
                "token": "...",
                "email_verified": false,
                "verificationCode": "482102f9-3cf8-444c-baa3-5efed6f21c7b",
                "verificationExpiry": "2022-06-29T03:56:07.266Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
    -   **/api/user/login**
        -   Unprotected route
        -   Accepted method - `POST`
        -   Body format -
            ```
            email: string, email, required, unique
            password: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "User Authenticated",
              "updatedUser": {
                "id": "62b92a56c18760f3a77c6fef",
                "username": "Raoul_MacGyver",
                "firstname": "Matilda",
                "lastname": "Schmidt",
                "phone": 7213503142,
                "email": "Esta.Schinner7@hotmail.com",
                "passwordHash": "...",
                "token": "...",
                "email_verified": false,
                "verificationCode": "482102f9-3cf8-444c-baa3-5efed6f21c7b",
                "verificationExpiry": "2022-06-29T03:56:07.266Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
    -   **/api/user/verify**
        -   Unprotected route
        -   Accepted method - `GET`
        -   Query format -
            ```
            ?code=<verification-code>
            ```
        -   Successful Response -
            ```
            {
              "message": "User verified",
              "verifiedUser": {
                "id": "62b92a56c18760f3a77c6fef",
                "username": "Raoul_MacGyver",
                "firstname": "Matilda",
                "lastname": "Schmidt",
                "phone": 7213503142,
                "email": "Esta.Schinner7@hotmail.com",
                "passwordHash": "...",
                "token": "...",
                "email_verified": true,
                "verificationCode": "482102f9-3cf8-444c-baa3-5efed6f21c7b",
                "verificationExpiry": "2022-06-29T03:56:07.266Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
-   For admin
    -   **/api/user**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
                "message": "Users found",
                "users": [
                    {
                        "id": "62b42d7d5202a4ef64e6821e",
                        "username": "Marielle13",
                        "firstname": "Hank",
                        "lastname": "Bauch",
                        "phone": 3982344774,
                        "email": "ankit@alphabi.co",
                        "passwordHash": "...",
                        "token": "...",
                        "email_verified": true,
                        "verificationCode": "db0f3ce0-55b2-4ad4-82bb-56098ddcbe1a",
                        "verificationExpiry": "2022-06-25T09:08:14.348Z",
                        "roleId": "..."
                    },
                    ...
                ]
            }
            ```
    -   **/api/user/{{userId}}**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
              "message": "User found",
              "user": {
                "id": "62b92a56c18760f3a77c6fef",
                "username": "Raoul_MacGyver",
                "firstname": "Matilda",
                "lastname": "Schmidt",
                "phone": 7213503142,
                "email": "Esta.Schinner7@hotmail.com",
                "passwordHash": "...",
                "token": "...",
                "email_verified": true,
                "verificationCode": "482102f9-3cf8-444c-baa3-5efed6f21c7b",
                "verificationExpiry": "2022-06-29T03:56:07.266Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
    -   **/api/user/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "User deleted",
              "user": {
                "id": "62b92a56c18760f3a77c6fef",
                "username": "Raoul_MacGyver",
                "firstname": "Garnett",
                "lastname": "Schmidt",
                "phone": 7213503142,
                "email": "Esta.Schinner7@hotmail.com",
                "passwordHash": "...",
                "token": "...",
                "email_verified": true,
                "verificationCode": "482102f9-3cf8-444c-baa3-5efed6f21c7b",
                "verificationExpiry": "2022-06-29T03:56:07.266Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
    -   **/api/user/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            username: string, optional
            firstname: string, optional
            lastname: string, optional
            phone: number, 10-digit, optional
            email: string, optional
            password: string, optional
            ```
        -   Successful Response -
            ```
            {
              "message": "User updated",
              "updatedUser": {
                "id": "62b92a56c18760f3a77c6fef",
                "username": "Raoul_MacGyver",
                "firstname": "Garnett",
                "lastname": "Schmidt",
                "phone": 7213503142,
                "email": "Esta.Schinner7@hotmail.com",
                "passwordHash": "...",
                "token": "...",
                "email_verified": true,
                "verificationCode": "482102f9-3cf8-444c-baa3-5efed6f21c7b",
                "verificationExpiry": "2022-06-29T03:56:07.266Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
-   For user
    -   **/api/user/check**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
              "message": "User Authenticated",
              "user": {
                "id": "62b92c8dc18760f3a77c6ff0",
                "email": "Angelita_Senger88@gmail.com",
                "iat": 1656302741,
                "exp": 1656309941
              }
            }
            ```
    -   **/api/user/{{userId}}**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
              "message": "User found",
              "user": {
                "id": "62b92c8dc18760f3a77c6ff0",
                "username": "Shaniya.Hagenes70",
                "firstname": "Jayde",
                "lastname": "Lowe",
                "phone": 8944501104,
                "email": "Angelita_Senger88@gmail.com",
                "passwordHash": "$2a$10$nTyn6Xk.l/1iGIitXqdjS.se4X0W6eTM.Nap.JCcpO.fxBCKWPu3u",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjkyYzhkYzE4NzYwZjNhNzdjNmZmMCIsImVtYWlsIjoiQW5nZWxpdGFfU2VuZ2VyODhAZ21haWwuY29tIiwiaWF0IjoxNjU2MzAyNzQxLCJleHAiOjE2NTYzMDk5NDF9.mlYpkPEvIoeqQyBwaUFxBgUH8M0wwrjSmjCvLrPh5jQ",
                "email_verified": true,
                "verificationCode": "7d696d95-fd0b-4783-8bfa-72823216b284",
                "verificationExpiry": "2022-06-29T04:05:34.217Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
        -   Unsuccessful Response - (if provided userId of another user)
            ```
            {
              "message": "Unauthorized access"
            }
            ```
    -   **/api/user/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            {} // empty object
            ```
        -   Successful Response -
            ```
            {
              "message": "User deleted",
              "user": {
                "id": "62b92c8dc18760f3a77c6ff0",
                "username": "Shaniya.Hagenes70",
                "firstname": "Vita",
                "lastname": "Lowe",
                "phone": 8944501104,
                "email": "Angelita_Senger88@gmail.com",
                "passwordHash": "...",
                "token": "...",
                "email_verified": true,
                "verificationCode": "7d696d95-fd0b-4783-8bfa-72823216b284",
                "verificationExpiry": "2022-06-29T04:05:34.217Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
    -   **/api/user/logout**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
              "message": "User logged out",
              "user": {
                "id": "62b92c8dc18760f3a77c6ff0",
                "username": "Shaniya.Hagenes70",
                "firstname": "Vita",
                "lastname": "Lowe",
                "phone": 8944501104,
                "email": "Angelita_Senger88@gmail.com",
                "passwordHash": "$2a$10$gXHnElKVStyKGfAmVAJstOhfPYjC8v.TkcKwb00rv7HKJ7eRFMG4K",
                "token": null,
                "email_verified": true,
                "verificationCode": "7d696d95-fd0b-4783-8bfa-72823216b284",
                "verificationExpiry": "2022-06-29T04:05:34.217Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
    -   **/api/user/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            username: string, optional
            firstname: string, optional
            lastname: string, optional
            phone: number, 10-digit, optional
            email: string, optional
            password: string, optional
            ```
        -   Successful Response -
            ```
            {
              "message": "User updated",
              "updatedUser": {
                "id": "62b92c8dc18760f3a77c6ff0",
                "username": "Shaniya.Hagenes70",
                "firstname": "Vita",
                "lastname": "Lowe",
                "phone": 8944501104,
                "email": "Angelita_Senger88@gmail.com",
                "passwordHash": "...",
                "token": "...",
                "email_verified": true,
                "verificationCode": "7d696d95-fd0b-4783-8bfa-72823216b284",
                "verificationExpiry": "2022-06-29T04:05:34.217Z",
                "roleId": "62b92a56c18760f3a77c6fee"
              }
            }
            ```
    -   **/api/user/progress**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
              "message": "User progress",
              "progress": {
                "user": {
                  "id": "62b92c8dc18760f3a77c6ff0",
                  "username": "Shaniya.Hagenes70",
                  "firstname": "Vita",
                  "lastname": "Lowe",
                  "phone": 8944501104,
                  "email": "Angelita_Senger88@gmail.com",
                  "passwordHash": "...",
                  "token": "...",
                  "email_verified": true,
                  "verificationCode": "7d696d95-fd0b-4783-8bfa-72823216b284",
                  "verificationExpiry": "2022-06-29T04:05:34.217Z",
                  "roleId": "62b92a56c18760f3a77c6fee"
                },
                "company": [
                  {
                    "id": "62b92e1cc18760f3a77c6ff2",
                    "name": "Gleason - Okuneva",
                    "description": "...",
                    "gstNumber": "nihil-impedit-aut",
                    "gstCertificate": "24006f9b-371a-4e94-97d0-cca08931d67c",
                    "panNumber": "illum-nesciunt-laboriosam",
                    "panCard": "fa672fc5-c221-433d-9d17-eed3eed0cdfd",
                    "aadharNumber": "natus-quis-modi",
                    "aadharCard": "cea7b47c-e9a5-4fc5-98df-df77937e9615",
                    "adminApproval": false,
                    "ownerId": "62b92c8dc18760f3a77c6ff0",
                    "tenant": {
                      "id": "62b92f8cc18760f3a77c6ff4",
                      "name": "Bergnaum, Glover and Johns",
                      "description": "...",
                      "companyId": "62b92e1cc18760f3a77c6ff2"
                    }
                  }
                ],
                "tenant": {
                  "id": "62b92f8cc18760f3a77c6ff4",
                  "name": "Bergnaum, Glover and Johns",
                  "description": "...",
                  "companyId": "62b92e1cc18760f3a77c6ff2"
                }
              }
            }
            ```

## Company Routes

-   For admin

    -   **/api/company**

        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Query format -
            ```
            query: <query-string> (will be searched in company name)
            adminApproval: true/false
            paginated: true/false
            count: number, required if paginated is true
            offset: number, required if paginated is true
            id: companyId
            ```
        -   Successful Response -

            ```
            // paginated
            {
                "message": "Companies found",
                "companies": {
                    "companies": [
                        {
                            "id": "62b6cf7ed1d0bbf6e05af363",
                            "name": "Kutch and Sons",
                            "description": "...",
                            "gstNumber": "et-laboriosam-sapiente",
                            "gstCertificate": "b18da190-ad34-4804-91d1-5ef6abc1fca5",
                            "panNumber": "repellat-perspiciatis-nemo",
                            "panCard": "cde5adb3-bb8b-44d4-8c1b-848e498de70c",
                            "aadharNumber": "omnis-repellendus-hic",
                            "aadharCard": "93e1ac8c-1d70-4bf1-9402-d8ebccaa61d0",
                            "adminApproval": false,
                            "ownerId": "62b6b594d1d0bbf6e05af35f",
                            "tenant": {
                                "id": "62b6cf83d1d0bbf6e05af364",
                                "name": "Gleichner - Lind",
                                "description": "...",
                                "companyId": "62b6cf7ed1d0bbf6e05af363"
                            }
                        },
                        {
                            "id": "62b6f1cfd1d0bbf6e05af369",
                            "name": "Hagenes and Sons",
                            "description": "...",
                            "gstNumber": "quidem-sequi-aliquid",
                            "gstCertificate": "3461353b-5838-4ce4-b665-a60113eef43b",
                            "panNumber": "ut-qui-eaque",
                            "panCard": "0212d3fe-639d-4cf7-8b2b-811e9e3dfa3c",
                            "aadharNumber": "voluptatum-ipsum-illum",
                            "aadharCard": "1b69164e-358f-4ea5-a2b4-c8ae03e8ce50",
                            "adminApproval": false,
                            "ownerId": "62b6f13bd1d0bbf6e05af368",
                            "tenant": {
                                "id": "62b6f1d7d1d0bbf6e05af36a",
                                "name": "Beier, White and Witting",
                                "description": "...",
                                "companyId": "62b6f1cfd1d0bbf6e05af369"
                            }
                        }
                    ],
                    "pagination": {
                        "offset": 0,
                        "count": 3,
                        "total_count": 2
                    }
                }
            }

            // not paginated
            {
                "message": "Companies found",
                "companies": [
                    {
                        "id": "62b6f1cfd1d0bbf6e05af369",
                        "name": "Hagenes and Sons",
                        "description": "...",
                        "gstNumber": "quidem-sequi-aliquid",
                        "gstCertificate": "3461353b-5838-4ce4-b665-a60113eef43b",
                        "panNumber": "ut-qui-eaque",
                        "panCard": "0212d3fe-639d-4cf7-8b2b-811e9e3dfa3c",
                        "aadharNumber": "voluptatum-ipsum-illum",
                        "aadharCard": "1b69164e-358f-4ea5-a2b4-c8ae03e8ce50",
                        "adminApproval": false,
                        "ownerId": "62b6f13bd1d0bbf6e05af368",
                        "tenant": {
                            "id": "62b6f1d7d1d0bbf6e05af36a",
                            "name": "Beier, White and Witting",
                            "description": "...",
                            "companyId": "62b6f1cfd1d0bbf6e05af369"
                        }
                    }
                ]
            }
            ```

    -   **/api/company/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            name: string, required
            description: string, required
            gstNumber: string, required
            gstCertificate: string, UUID v4 format, optional
            panNumber: string, required
            panCard: string, UUID v4 format, optional
            aadharNumber: string, required
            aadharCard: string, UUID v4 format, optional
            adminApproval: boolean, default - false
            ownerId: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "New Company Created",
              "company": {
                "id": "62b92dc6c18760f3a77c6ff1",
                "name": "Hagenes LLC",
                "description": "...",
                "gstNumber": "molestiae-repudiandae-necessitatibus",
                "gstCertificate": "f5e46a33-1398-482e-a8e9-e7954853bc79",
                "panNumber": "voluptatem-fuga-nesciunt",
                "panCard": "0dd86fbd-84e9-41ad-a281-9cfc8c2f08c1",
                "aadharNumber": "voluptatum-sed-eaque",
                "aadharCard": "94a980f7-3cfb-4db8-85e6-4647d8d8e8cd",
                "adminApproval": false,
                "ownerId": "62b92c8dc18760f3a77c6ff0"
              }
            }
            ```
    -   **/api/company/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Company deleted",
              "company": {
                "id": "62b92dc6c18760f3a77c6ff1",
                "name": "Hagenes LLC",
                "description": "...",
                "gstNumber": "molestiae-repudiandae-necessitatibus",
                "gstCertificate": "f5e46a33-1398-482e-a8e9-e7954853bc79",
                "panNumber": "voluptatem-fuga-nesciunt",
                "panCard": "0dd86fbd-84e9-41ad-a281-9cfc8c2f08c1",
                "aadharNumber": "voluptatum-sed-eaque",
                "aadharCard": "94a980f7-3cfb-4db8-85e6-4647d8d8e8cd",
                "adminApproval": false,
                "ownerId": "62b92c8dc18760f3a77c6ff0"
              }
            }
            ```
    -   **/api/company/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            name: string, optional
            description: string, optional
            gstNumber: string, optional
            gstCertificate: string, UUID v4 format, optional
            panNumber: string, optional
            panCard: string, UUID v4 format, optional
            aadharNumber: string, optional
            aadharCard: string, UUID v4 format, optional
            adminApproval: boolean, optional
            ```
        -   Successful Response -
            ```
            {
                "message": "Company updated",
                "updatedCompany": {
                    "id": "62b92dc6c18760f3a77c6ff1",
                    "name": "Hagenes LLC",
                    "description": "...",
                    "gstNumber": "molestiae-repudiandae-necessitatibus",
                    "gstCertificate": "f5e46a33-1398-482e-a8e9-e7954853bc79",
                    "panNumber": "voluptatem-fuga-nesciunt",
                    "panCard": "0dd86fbd-84e9-41ad-a281-9cfc8c2f08c1",
                    "aadharNumber": "voluptatum-sed-eaque",
                    "aadharCard": "94a980f7-3cfb-4db8-85e6-4647d8d8e8cd",
                    "adminApproval": false,
                    "ownerId": "62b92c8dc18760f3a77c6ff0",
                    "tenant": {...}
                }
            }
            ```

-   For user
    -   **/api/company**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Query format - no query
        -   Successful Response -
            ```
            {
                "message": "Company found",
                "company": {
                    "id": "62b92e1cc18760f3a77c6ff2",
                    "name": "Gleason - Okuneva",
                    "description": "In quod esse ut distinctio voluptas et quia. Illum debitis cumque aperiam non ad. Quia voluptatum explicabo ut voluptatem quo. Autem totam pariatur qui aut consequatur iste. Quod sint qui delectus.",
                    "gstNumber": "nihil-impedit-aut",
                    "gstCertificate": "24006f9b-371a-4e94-97d0-cca08931d67c",
                    "panNumber": "illum-nesciunt-laboriosam",
                    "panCard": "fa672fc5-c221-433d-9d17-eed3eed0cdfd",
                    "aadharNumber": "natus-quis-modi",
                    "aadharCard": "cea7b47c-e9a5-4fc5-98df-df77937e9615",
                    "adminApproval": false,
                    "ownerId": "62b92c8dc18760f3a77c6ff0",
                    "tenant": {...}
                }
            }
            ```
        -   Unsuccessful Response -
            ```
            {
              "message": "User does not have a company"
            }
            ```
    -   **/api/company/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            name: string, required
            description: string, required
            gstNumber: string, required
            gstCertificate: string, UUID v4 format, optional
            panNumber: string, required
            panCard: string, UUID v4 format, optional
            aadharNumber: string, required
            aadharCard: string, UUID v4 format, optional
            adminApproval: boolean, default - false
            ```
        -   Successful Response -
            ```
            {
              "message": "New Company Created",
              "company": {
                "id": "62b92e1cc18760f3a77c6ff2",
                "name": "Gleason - Okuneva",
                "description": "...",
                "gstNumber": "nihil-impedit-aut",
                "gstCertificate": "24006f9b-371a-4e94-97d0-cca08931d67c",
                "panNumber": "illum-nesciunt-laboriosam",
                "panCard": "fa672fc5-c221-433d-9d17-eed3eed0cdfd",
                "aadharNumber": "natus-quis-modi",
                "aadharCard": "cea7b47c-e9a5-4fc5-98df-df77937e9615",
                "adminApproval": false,
                "ownerId": "62b92c8dc18760f3a77c6ff0"
              }
            }
            ```
    -   **/api/company/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Company deleted",
              "company": {
                "id": "62b92e1cc18760f3a77c6ff2",
                "name": "Gleason - Okuneva",
                "description": "...",
                "gstNumber": "nihil-impedit-aut",
                "gstCertificate": "24006f9b-371a-4e94-97d0-cca08931d67c",
                "panNumber": "illum-nesciunt-laboriosam",
                "panCard": "fa672fc5-c221-433d-9d17-eed3eed0cdfd",
                "aadharNumber": "natus-quis-modi",
                "aadharCard": "cea7b47c-e9a5-4fc5-98df-df77937e9615",
                "adminApproval": false,
                "ownerId": "62b92c8dc18760f3a77c6ff0"
              }
            }
            ```
    -   **/api/company/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            name: string, optional
            description: string, optional
            gstNumber: string, optional
            gstCertificate: string, UUID v4 format, optional
            panNumber: string, optional
            panCard: string, UUID v4 format, optional
            aadharNumber: string, optional
            aadharCard: string, UUID v4 format, optional
            adminApproval: boolean, optional
            ```
        -   Successful Response -
            ```
            {
                "message": "Company updated",
                "updatedCompany": {
                    "id": "62b92dc6c18760f3a77c6ff1",
                    "name": "Hagenes LLC",
                    "description": "...",
                    "gstNumber": "molestiae-repudiandae-necessitatibus",
                    "gstCertificate": "f5e46a33-1398-482e-a8e9-e7954853bc79",
                    "panNumber": "voluptatem-fuga-nesciunt",
                    "panCard": "0dd86fbd-84e9-41ad-a281-9cfc8c2f08c1",
                    "aadharNumber": "voluptatum-sed-eaque",
                    "aadharCard": "94a980f7-3cfb-4db8-85e6-4647d8d8e8cd",
                    "adminApproval": false,
                    "ownerId": "62b92c8dc18760f3a77c6ff0",
                    "tenant": {...}
                }
            }
            ```

Tenant Routes

-   For admin
    -   **/api/tenant**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Query format -
            ```
            id: string, optional
            query: string, optional
            adminApproval: boolean, optional
            paginated: boolean, optional
            count: number, required if paginated is true
            offset: number, required if paginated is true
            ```
        -   Successful Response -
            ```
            {
                "message": "Tenants found",
                "tenants": [
                    {
                        "id": "62b4372d5202a4ef64e68222",
                        "name": "Champlin - Stoltenberg",
                        "description": "...",
                        "companyId": "62b42eb85202a4ef64e68220"
                    },
                    {
                        "id": "62b448c32f5e9048863fd164",
                        "name": "Grant and Sons",
                        "description": "...",
                        "companyId": "62b448832f5e9048863fd162"
                    },
                    ...
                ]
            }
            ```
    -   **/api/tenant/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            companyId: string, required
            name: string, required
            description: string, required
            ```
        -   Successful Response -
            ```
            {
                "message": "New Tenant Created",
                "tenant": {
                    "id": "62b92f44c18760f3a77c6ff3",
                    "name": "Boehm - Kuhn",
                    "description": "...",
                    "companyId": "62b92e1cc18760f3a77c6ff2",
                    "company": {...}
                }
            }
            ```
    -   **/api/tenant/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Tenant deleted",
              "tenant": {
                "id": "62b92f44c18760f3a77c6ff3",
                "name": "Pagac - Hansen",
                "description": "...",
                "companyId": "62b92e1cc18760f3a77c6ff2"
              }
            }
            ```
    -   **/api/tenant/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            name: string, optional
            description: string, optional
            ```
        -   Successful Response -
            ```
            {
                "message": "Tenant updated",
                "tenant": {
                    "id": "62b92f44c18760f3a77c6ff3",
                    "name": "Pagac - Hansen",
                    "description": "...",
                    "companyId": "62b92e1cc18760f3a77c6ff2",
                    "company": {...}
                }
            }
            ```
-   For user
    -   **/api/tenant**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Query format - No query
        -   Successful Response -
            ```
            {
              "message": "Tenant found",
              "tenant": {
                "id": "62b92f8cc18760f3a77c6ff4",
                "name": "Johnston Inc",
                "description": "Harum id id culpa dolorem et delectus. Eum nobis nam. Repudiandae rem odit nemo tenetur.",
                "companyId": "62b92e1cc18760f3a77c6ff2"
              }
            }
            ```
    -   **/api/tenant/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            name: string, required
            description: string, required
            ```
        -   Successful Response -
            ```
            {
                "message": "New Tenant Created",
                "tenant": {
                    "id": "62b92f44c18760f3a77c6ff3",
                    "name": "Boehm - Kuhn",
                    "description": "...",
                    "companyId": "62b92e1cc18760f3a77c6ff2",
                    "company": {...}
                }
            }
            ```
    -   **/api/tenant/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Tenant deleted",
              "tenant": {
                "id": "62b92f44c18760f3a77c6ff3",
                "name": "Pagac - Hansen",
                "description": "...",
                "companyId": "62b92e1cc18760f3a77c6ff2"
              }
            }
            ```
    -   **/api/tenant/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            name: string, optional
            description: string, optional
            ```
        -   Successful Response -
            ```
            {
                "message": "Tenant updated",
                "tenant": {
                    "id": "62b92f44c18760f3a77c6ff3",
                    "name": "Pagac - Hansen",
                    "description": "...",
                    "companyId": "62b92e1cc18760f3a77c6ff2",
                    "company": {...}
                }
            }
            ```

Associations **Routes**

-   For admin
    -   **/api/association**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Query format - No query
        -   Successful Response -
            ```
            {
                "message": "Associations found",
                "associations": [
                    {
                        "id": "62b92fd2c18760f3a77c6ff5",
                        "userId": "62b92c8dc18760f3a77c6ff0",
                        "tenantId": "62b92f8cc18760f3a77c6ff4",
                        "approval": false
                    },
                          ...
                ]
            }
            ```
    -   **/api/association/{{associationId}}**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Query format - No query
        -   Successful Response -
            ```
            {
              "message": "Association found",
              "association": {
                "id": "62b92fd2c18760f3a77c6ff5",
                "userId": "62b92c8dc18760f3a77c6ff0",
                "tenantId": "62b92f8cc18760f3a77c6ff4",
                "approval": false
              }
            }
            ```
    -   **/api/association/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            userId: string, required
            tenantId: string, required
            approval: boolean, optional, default - false
            ```
        -   Successful Response -
            ```
            {
              "message": "New Association Created",
              "createdAssociation": {
                "id": "62b92fd2c18760f3a77c6ff5",
                "userId": "62b92c8dc18760f3a77c6ff0",
                "tenantId": "62b92f8cc18760f3a77c6ff4",
                "approval": false
              }
            }
            ```
    -   **/api/association/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Association deleted",
              "deletedAssociation": {
                "id": "62b92fd2c18760f3a77c6ff5",
                "userId": "62b92c8dc18760f3a77c6ff0",
                "tenantId": "62b92f8cc18760f3a77c6ff4",
                "approval": true
              }
            }
            ```
    -   **/api/association/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            userId: string, required
            tenantId: string, optional
            approval: boolean, optional
            ```
        -   Successful Response -
            ```
            {
              "message": "Association updated",
              "updatedAssociation": {
                "id": "62b92fd2c18760f3a77c6ff5",
                "userId": "62b92c8dc18760f3a77c6ff0",
                "tenantId": "62b92f8cc18760f3a77c6ff4",
                "approval": true
              }
            }
            ```
-   For user
    -   **/api/association/{{associationId}}**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Query format - No query
        -   Conditions - user can only access their own associations
        -   Successful Response -
            ```
            {
              "message": "Association found",
              "association": {
                "id": "62b9300bc18760f3a77c6ff6",
                "userId": "62b92c8dc18760f3a77c6ff0",
                "tenantId": "62b92f8cc18760f3a77c6ff4",
                "approval": false
              }
            }
            ```
    -   **/api/association/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            tenantId: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "New Association Created",
              "createdAssociation": {
                "id": "62b92fd2c18760f3a77c6ff5",
                "userId": "62b92c8dc18760f3a77c6ff0",
                "tenantId": "62b92f8cc18760f3a77c6ff4",
                "approval": false
              }
            }
            ```
    -   **/api/association/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Association deleted",
              "deletedAssociation": {
                "id": "62b9300bc18760f3a77c6ff6",
                "userId": "62b92c8dc18760f3a77c6ff0",
                "tenantId": "62b92f8cc18760f3a77c6ff4",
                "approval": true
              }
            }
            ```
    -   **/api/association/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            tenantId: string, optional
            ```
        -   Successful Response -
            ```
            {
              "message": "Association updated",
              "updatedAssociation": {
                "id": "62b9300bc18760f3a77c6ff6",
                "userId": "62b92c8dc18760f3a77c6ff0",
                "tenantId": "62b92f8cc18760f3a77c6ff4",
                "approval": true
              }
            }
            ```

## Category Routes

-   For admin -
    -   **/api/products/category**
        -   Protected route - auth token needed (either user or admin)
        -   Accepted method - `GET`
        -   Query format -
            ```
            id: string, optional
            isRoot: true/false, optional
            query: string, optional (will be searched in name)
            includeChildren: true/false, optional
            ```
        -   Successful Response -
            ```
            {
              "message": "Categories found",
              "categories": [
                {
                  "id": "62bad0b6f4b8ec8aad5ced34",
                  "name": "Fantastic",
                  "description": "Ut ipsam sed facilis. Dignissimos quaerat numquam voluptatibus. Ratione molestiae ipsam.",
                  "slug": "aspernatur-animi-quia",
                  "root": true,
                  "parentCategoryId": null,
                  "children": [
                    {
                      "id": "62bad793f4b8ec8aad5ced35",
                      "name": "Sleek",
                      "description": "Illum tempore neque amet dolor. Deleniti quia molestias quas omnis autem. Tenetur maiores quia. Aut et omnis consequuntur dolorem accusantium dolor.",
                      "slug": "modi-est-atque",
                      "root": false,
                      "parentCategoryId": "62bad0b6f4b8ec8aad5ced34"
                    },
                    ...
                  ]
                }
              ]
            }
            ```
    -   **/api/products/category/create**
        -   Protected route - auth token needed (either user or admin)
        -   Accepted method - `POST`
        -   Body format -
            ```
            name: string, required
            description: string, required
            slug: string, required
            parentCategoryId: string, optional
            ```
        -   Successful Response -
            ```
            {
              "message": "New Category Created",
              "category": {
                "id": "62bad79ff4b8ec8aad5ced38",
                "name": "Unbranded",
                "description": "...",
                "slug": "dolore-aliquid-explicabo",
                "root": false,
                "parentCategoryId": "62bad0b6f4b8ec8aad5ced34"
              }
            }
            ```
    -   **/api/products/category/delete**
        -   Protected route - auth token needed (either user or admin)
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Category Deleted",
              "category": {
                "id": "62badc78f4b8ec8aad5ced39",
                "name": "Practical",
                "description": "...",
                "slug": "quis-quasi-animi",
                "root": false,
                "parentCategoryId": "62bad79ff4b8ec8aad5ced38"
              }
            }
            ```
    -   **/api/products/category/update**
        -   Protected route - auth token needed (either user or admin)
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            name: string, optional
            description: string, optional
            slug: string, optional
            parentCategoryId: string, optional
            ```
        -   Successful Response -
            ```
            {
              "message": "Category Updated",
              "category": {
                "id": "62badc78f4b8ec8aad5ced39",
                "name": "Practical",
                "description": "...",
                "slug": "quis-quasi-animi",
                "root": false,
                "parentCategoryId": "62bad79ff4b8ec8aad5ced38"
              }
            }
            ```

## Attribute Routes

-   Common
    -   **/api/products/attribute**
        -   Protected route - auth token needed (either user or admin)
        -   Accepted method - `GET`
        -   Query format -
            ```
            id: string, optional
            query: string, optional (searched in name)
            ```
        -   Successful Response -
            ```
            {
              "message": "Attributes found",
              "attributes": [
                {
                  "id": "62baf1ea6f5b9fe8bdff4520",
                  "name": "Consultant",
                  "description": "...",
                  "slug": "temporibus-sed-repellendus"
                },
                ...
              ]
            }
            ```
    -   **/api/products/attribute/create**
        -   Protected route - auth token needed (either user or admin)
        -   Accepted method - `POST`
        -   Body format -
            ```
            name: string, required
            description: string, required
            slug: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "New Attribute Created",
              "attribute": {
                "id": "62baf3826f5b9fe8bdff4524",
                "name": "enhance",
                "description": "...",
                "slug": "est-odio-quo"
              }
            }
            ```
    -   **/api/products/attribute/delete**
        -   Protected route - auth token needed (either user or admin)
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Attribute Deleted",
              "attribute": {
                "id": "62baf3826f5b9fe8bdff4524",
                "name": "Industrial",
                "description": "...",
                "slug": "est-odio-quo"
              }
            }
            ```
    -   **/api/products/attribute/update**
        -   Protected route - auth token needed (either user or admin)
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            name: string, optional
            description: string, optional
            slug: string, optional
            ```
        -   Successful Response -
            ```
            {
              "message": "Attribute Updated",
              "attribute": {
                "id": "62baf3826f5b9fe8bdff4524",
                "name": "Industrial",
                "description": "...",
                "slug": "est-odio-quo"
              }
            }
            ```

## Product routes

-   For admin -
    -   **/api/products/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            name: string, required
            description: string, required
            shortDescriptions: string, required
            slug: string, required
            quantity: number, default - 0
            supplierId: string, required
            published: boolean, default - false
            attributes: object, required, structure - {key: [...arr]}
            categoryIds: array, required
            locationIds: array, required
            manufacturer: string, required
            countryOfOrigin: string, required
            trending: boolean, required
            featuredFrom: date, required
            featuredTo: date, required
            guestCheckout: boolean, required
            private_product: boolean, required
            marketPlace: boolean, required
            reseller: {
              allowed: boolean, required
              type: string, allowed values - ('commission', 'discount'), required if allowed is true
              discount: number, min - 0, max - 100
              commission: number, min - 0, max - 100
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "New Product Created",
              "product": {
                "id": "62d1159c504963bf2f1d4c58",
                "name": "Sleek Rubber Pizza",
                "description": "...",
                "slug": "esse-dolores-libero",
                "quantity": 608,
                "supplierId": "62b97af7190404e5c50e045d",
                "published": true,
                "attributes": {
                  "size": [
                    "l",
                    "m",
                    "s"
                  ],
                  "color": [
                    "red",
                    "blue"
                  ]
                },
                "categoryIds": [
                  "62c010ebd49389ce1fc48ac9"
                ],
                "manufacturer": "ABC Industries",
                "locationIds": [
                  "62cebef175a4f7a690b8ead2"
                ],
                "countryOfOrigin": "India",
                "trending": false,
                "featuredFrom": "2022-07-15T07:22:03.556Z",
                "featuredTo": "2022-07-15T07:22:03.556Z",
                "guestCheckout": false,
                "private_product": true,
                "marketPlace": true
              }
            }
            ```
    -   **/api/products**
        -   Unprotected route
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, optional
            query: string, optional
            inStock: boolean, optional
            published: boolean, optional
            supplierId: string, optional
            categoryId: string, optional
            attributes: object, optional
            sortBy: string, optional
            order: string, allowed values - 'desc'/'asc', optional
            pagination: boolean, optional
            offset: number, optional
            limit: number, optional
            locationIds: array, optional
            manufacturer: string, optional
            countryOfOrigin: string, optional
            trending: boolean, optional
            featuredFrom: date, optional
            featuredTo: date, optional
            guestCheckout: boolean, optional
            private_product: boolean, optional
            marketPlace: boolean, optional
            reseller: {
              allowed: boolean, optional
              type: string, allowed values - ('commission', 'discount'), optional
              discount: number, min - 0, max - 100
              commission: number, min - 0, max - 100
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "Products found",
              "products": {
                "products": [
                  {
                    "name": "Rustic Granite Pants",
                    "description": "Esse consequatur nulla. Qui aspernatur nulla reprehenderit veritatis consequatur cum porro. Sequi adipisci atque error hic officiis minima. Id laborum qui quia dolorem facilis hic et eaque aperiam. Mollitia voluptatum optio dolorem. Ab minus eum.",
                    "shortDescriptions": "Corporis deleniti non vero et.",
                    "slug": "est-vel-velit",
                    "quantity": 980,
                    "published": true,
                    "attributes": {
                        "size": [
                            "l",
                            "m",
                            "s"
                        ],
                        "color": [
                            "red",
                            "blue"
                        ]
                    },
                    "manufacturer": "ABC Industries",
                    "countryOfOrigin": "India",
                    "trending": true,
                    "guestCheckout": true,
                    "private_product": true,
                    "marketPlace": false,
                    "categories": [
                        {
                            "name": "Awesome",
                            "description": "Aut qui ut debitis enim molestias incidunt. Incidunt voluptatem vero. Numquam animi consequatur qui. Ut dolore in error officiis voluptatem.",
                            "slug": "nam-quia-voluptatem"
                        }
                    ],
                    "locations": [
                        {
                            "name": "est sit rerum",
                            "address": "63250 Pamela Ridges",
                            "state": "North Katharinaburgh",
                            "country": "Venezuela"
                        }
                    ],
                    "id": "62d119f9d1ec38d5d0dcbb78",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "categoryIds": [
                        "62c010ebd49389ce1fc48ac9"
                    ],
                    "locationIds": [
                        "62d119e1d1ec38d5d0dcbb75"
                    ],
                    "featuredFrom": "2022-07-15T07:40:41.748Z",
                    "featuredTo": "2022-07-15T07:40:41.748Z"
                  },
                  {
                    "name": "Rustic Metal Computer",
                    "description": "Impedit vitae est. Ut nesciunt voluptas vel expedita necessitatibus tenetur reprehenderit. Vero excepturi aut sunt debitis dolores deleniti. Aut enim nostrum. Quis est rerum.",
                    "shortDescriptions": "Eum voluptates et voluptas voluptate nihil vitae aut molestiae.",
                    "slug": "ea-consectetur-quia",
                    "quantity": 875,
                    "published": true,
                    "attributes": {
                        "size": [
                            "l",
                            "m",
                            "s"
                        ],
                        "color": [
                            "red",
                            "blue"
                        ]
                    },
                    "manufacturer": "ABC Industries",
                    "countryOfOrigin": "India",
                    "trending": false,
                    "guestCheckout": true,
                    "private_product": true,
                    "marketPlace": true,
                    "categories": [
                        {
                            "name": "Awesome",
                            "description": "Aut qui ut debitis enim molestias incidunt. Incidunt voluptatem vero. Numquam animi consequatur qui. Ut dolore in error officiis voluptatem.",
                            "slug": "nam-quia-voluptatem"
                        }
                    ],
                    "locations": [
                        {
                            "name": "est sit rerum",
                            "address": "63250 Pamela Ridges",
                            "state": "North Katharinaburgh",
                            "country": "Venezuela"
                        }
                    ],
                    "id": "62d119eed1ec38d5d0dcbb76",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "categoryIds": [
                        "62c010ebd49389ce1fc48ac9"
                    ],
                    "locationIds": [
                        "62d119e1d1ec38d5d0dcbb75"
                    ],
                    "featuredFrom": "2022-07-15T07:40:29.540Z",
                    "featuredTo": "2022-07-15T07:40:29.540Z"
                  }
                ],
                "pagination": {
                    "total_count": 14,
                    "limit": 2,
                    "offset": 7
                }
              }
            }
            ```
    -   **/api/products/{{productId}}**
        -   Unprotected route
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
                "message": "Product found",
                "product": [
                    {
                        "id": "62c01203d49389ce1fc48ace",
                        "name": "Licensed Soft Sausages",
                        "description": "...",
                        "shortDescriptions": "Qui et qui eveniet.",
                        "slug": "veritatis-molestiae-accusantium",
                        "quantity": 725,
                        "supplierId": "62b97af7190404e5c50e045d",
                        "published": false,
                        "attributes": {
                            "size": [
                                "l",
                                "m",
                                "s"
                            ],
                            "color": [
                                "red",
                                "blue"
                            ]
                        },
                        "categoryIds": [
                            "62c010ebd49389ce1fc48ac9"
                        ]
                    }
                ]
            }
            ```
    -   **/api/products/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            updateData: {
              name: string, optional
              description: string, optional
              shortDescriptions: string, optional
              slug: string, optional
              quantity: number, optional
              attributes: object, optional, structure - {key: [...arr]}
              categoryIds: array, optional
              locationIds: array, optional
              categories: object, optional, can be used to specify connect or disconnect object
              locations: object, optional, can be used to specify connect or disconnect object
              manufacturer: string, optional
              countryOfOrigin: string, optional
              trending: boolean, optional
              featuredFrom: date, ISO Timestamp, optional
              featuredTo: date, ISO Timestamp, optional
              guestCheckout: boolean, optional
              private_product: boolean, optional
              marketPlace: boolean, optional,
              reseller: {
                allowed: boolean, required
                type: string, allowed values - ('commission', 'discount'), required
                discount: number, min - 0, max - 100
                commission: number, min - 0, max - 100
              }
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "Product updated",
              "product": {
                "id": "62d1159c504963bf2f1d4c58",
                "name": "Small Plastic Soap",
                "description": "Laborum id voluptatem repellendus itaque ipsa ipsum repellendus. Error id molestias libero tempora temporibus facere molestias. Blanditiis dolor earum magnam magnam vero enim aut et.",
                "shortDescriptions": "Dicta exercitationem vero quae odit dolor.",
                "slug": "esse-dolores-libero",
                "quantity": 611,
                "supplierId": "62b97af7190404e5c50e045d",
                "published": true,
                "attributes": {
                  "size": [
                    "l",
                    "m",
                    "s"
                  ],
                  "color": [
                    "red",
                    "blue"
                  ]
                },
                "categoryIds": [
                  "62c010ebd49389ce1fc48ac9"
                ],
                "manufacturer": "ABC Industries",
                "locationIds": [
                  "62cebef175a4f7a690b8ead2"
                ],
                "countryOfOrigin": "India",
                "trending": false,
                "featuredFrom": "2022-07-15T07:22:03.556Z",
                "featuredTo": "2022-07-15T07:22:03.556Z",
                "guestCheckout": false,
                "private_product": true,
                "marketPlace": true
              }
            }
            ```
    -   **/api/products/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
                "message": "Product deleted",
                "product": {
                    "id": "62c00dcad49389ce1fc48ac0",
                    "name": "Ergonomic Wooden Salad",
                    "description": "...",
                    "shortDescriptions": "...",
                    "slug": "explicabo-aspernatur-dolorem",
                    "quantity": 142,
                    "supplierId": "62b97af7190404e5c50e045d",
                    "published": true,
                    "attributes": {
                        "size": [
                            "l",
                            "m",
                            "s"
                        ],
                        "color": [
                            "red",
                            "blue"
                        ]
                    },
                    "categoryIds": [
                        "62c00b39d49389ce1fc48abd"
                    ]
                }
            }
            ```
-   For user -
    -   **/api/products/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            name: string, required
            description: string, required
            shortDescriptions: string, required
            slug: string, required
            quantity: number, default - 0
            published: boolean, default - false
            attributes: object, required, structure - {key: [...arr]}
            categoryIds: array, required,
            locationIds: array, required
            manufacturer: string, required
            countryOfOrigin: string, required
            trending: boolean, required
            featuredFrom: date, required
            featuredTo: date, required
            guestCheckout: boolean, required
            private_product: boolean, required
            marketPlace: boolean, required,
            reseller: {
              allowed: boolean, required
              type: string, allowed values - ('commission', 'discount'), required if allowed is true
              discount: number, min - 0, max - 100
              commission: number, min - 0, max - 100
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "New Product Created",
              "product": {
                "id": "62d1159c504963bf2f1d4c58",
                "name": "Sleek Rubber Pizza",
                "description": "...",
                "slug": "esse-dolores-libero",
                "quantity": 608,
                "supplierId": "62b97af7190404e5c50e045d",
                "published": true,
                "attributes": {
                  "size": [
                    "l",
                    "m",
                    "s"
                  ],
                  "color": [
                    "red",
                    "blue"
                  ]
                },
                "categoryIds": [
                  "62c010ebd49389ce1fc48ac9"
                ],
                "manufacturer": "ABC Industries",
                "locationIds": [
                  "62cebef175a4f7a690b8ead2"
                ],
                "countryOfOrigin": "India",
                "trending": false,
                "featuredFrom": "2022-07-15T07:22:03.556Z",
                "featuredTo": "2022-07-15T07:22:03.556Z",
                "guestCheckout": false,
                "private_product": true,
                "marketPlace": true
              }
            }
            ```
    -   **/api/products**
        -   Unprotected route
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, optional
            query: string, optional
            inStock: boolean, optional
            published: boolean, optional
            supplierId: string, optional
            categoryId: string, optional
            attributes: object, optional
            sortBy: string, optional
            order: string, allowed values - 'desc'/'asc', optional
            pagination: boolean, optional
            offset: number, optional
            limit: number, optional
            locationIds: array, optional
            manufacturer: string, optional
            countryOfOrigin: string, optional
            trending: boolean, optional
            featuredFrom: date, optional
            featuredTo: date, optional
            guestCheckout: boolean, optional
            private_product: boolean, optional
            marketPlace: boolean, optional,
            reseller: {
              allowed: boolean, optional
              type: string, allowed values - ('commission', 'discount'), optional
              discount: number, min - 0, max - 100
              commission: number, min - 0, max - 100
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "Products found",
              "products": {
                "products": [
                  {
                    "name": "Rustic Granite Pants",
                    "description": "Esse consequatur nulla. Qui aspernatur nulla reprehenderit veritatis consequatur cum porro. Sequi adipisci atque error hic officiis minima. Id laborum qui quia dolorem facilis hic et eaque aperiam. Mollitia voluptatum optio dolorem. Ab minus eum.",
                    "shortDescriptions": "Corporis deleniti non vero et.",
                    "slug": "est-vel-velit",
                    "quantity": 980,
                    "published": true,
                    "attributes": {
                        "size": [
                            "l",
                            "m",
                            "s"
                        ],
                        "color": [
                            "red",
                            "blue"
                        ]
                    },
                    "manufacturer": "ABC Industries",
                    "countryOfOrigin": "India",
                    "trending": true,
                    "guestCheckout": true,
                    "private_product": true,
                    "marketPlace": false,
                    "categories": [
                        {
                            "name": "Awesome",
                            "description": "Aut qui ut debitis enim molestias incidunt. Incidunt voluptatem vero. Numquam animi consequatur qui. Ut dolore in error officiis voluptatem.",
                            "slug": "nam-quia-voluptatem"
                        }
                    ],
                    "locations": [
                        {
                            "name": "est sit rerum",
                            "address": "63250 Pamela Ridges",
                            "state": "North Katharinaburgh",
                            "country": "Venezuela"
                        }
                    ],
                    "id": "62d119f9d1ec38d5d0dcbb78",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "categoryIds": [
                        "62c010ebd49389ce1fc48ac9"
                    ],
                    "locationIds": [
                        "62d119e1d1ec38d5d0dcbb75"
                    ],
                    "featuredFrom": "2022-07-15T07:40:41.748Z",
                    "featuredTo": "2022-07-15T07:40:41.748Z"
                  },
                  {
                    "name": "Rustic Metal Computer",
                    "description": "Impedit vitae est. Ut nesciunt voluptas vel expedita necessitatibus tenetur reprehenderit. Vero excepturi aut sunt debitis dolores deleniti. Aut enim nostrum. Quis est rerum.",
                    "shortDescriptions": "Eum voluptates et voluptas voluptate nihil vitae aut molestiae.",
                    "slug": "ea-consectetur-quia",
                    "quantity": 875,
                    "published": true,
                    "attributes": {
                        "size": [
                            "l",
                            "m",
                            "s"
                        ],
                        "color": [
                            "red",
                            "blue"
                        ]
                    },
                    "manufacturer": "ABC Industries",
                    "countryOfOrigin": "India",
                    "trending": false,
                    "guestCheckout": true,
                    "private_product": true,
                    "marketPlace": true,
                    "categories": [
                        {
                            "name": "Awesome",
                            "description": "Aut qui ut debitis enim molestias incidunt. Incidunt voluptatem vero. Numquam animi consequatur qui. Ut dolore in error officiis voluptatem.",
                            "slug": "nam-quia-voluptatem"
                        }
                    ],
                    "locations": [
                        {
                            "name": "est sit rerum",
                            "address": "63250 Pamela Ridges",
                            "state": "North Katharinaburgh",
                            "country": "Venezuela"
                        }
                    ],
                    "id": "62d119eed1ec38d5d0dcbb76",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "categoryIds": [
                        "62c010ebd49389ce1fc48ac9"
                    ],
                    "locationIds": [
                        "62d119e1d1ec38d5d0dcbb75"
                    ],
                    "featuredFrom": "2022-07-15T07:40:29.540Z",
                    "featuredTo": "2022-07-15T07:40:29.540Z"
                  }
                ],
                "pagination": {
                    "total_count": 14,
                    "limit": 2,
                    "offset": 7
                }
              }
            }
            ```
    -   **/api/products/{{productId}}**
        -   Unprotected route
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
                "message": "Product found",
                "product": [
                    {
                        "id": "62c01203d49389ce1fc48ace",
                        "name": "Licensed Soft Sausages",
                        "description": "...",
                        "shortDescriptions": "Qui et qui eveniet.",
                        "slug": "veritatis-molestiae-accusantium",
                        "quantity": 725,
                        "supplierId": "62b97af7190404e5c50e045d",
                        "published": false,
                        "attributes": {
                            "size": [
                                "l",
                                "m",
                                "s"
                            ],
                            "color": [
                                "red",
                                "blue"
                            ]
                        },
                        "categoryIds": [
                            "62c010ebd49389ce1fc48ac9"
                        ]
                    }
                ]
            }
            ```
    -   **/api/products/update**
        -   Protected route - bearer token needed
        -   Accessible only by owner
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            updateData: {
              name: string, optional
              description: string, optional
              shortDescriptions: string, optional
              slug: string, optional
              quantity: number, optional
              attributes: object, optional, structure - {key: [...arr]}
              categoryIds: array, optional
              locationIds: array, optional
              categories: object, optional, can be used to specify connect or disconnect object
              locations: object, optional, can be used to specify connect or disconnect object
              manufacturer: string, optional
              countryOfOrigin: string, optional
              trending: boolean, optional
              featuredFrom: date, ISO Timestamp, optional
              featuredTo: date, ISO Timestamp, optional
              guestCheckout: boolean, optional
              private_product: boolean, optional
              marketPlace: boolean, optional,
              reseller: {
                allowed: boolean, required
                type: string, allowed values - ('commission', 'discount'), required
                discount: number, min - 0, max - 100
                commission: number, min - 0, max - 100
              }
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "Product updated",
              "product": {
                "id": "62d1159c504963bf2f1d4c58",
                "name": "Small Plastic Soap",
                "description": "Laborum id voluptatem repellendus itaque ipsa ipsum repellendus. Error id molestias libero tempora temporibus facere molestias. Blanditiis dolor earum magnam magnam vero enim aut et.",
                "shortDescriptions": "Dicta exercitationem vero quae odit dolor.",
                "slug": "esse-dolores-libero",
                "quantity": 611,
                "supplierId": "62b97af7190404e5c50e045d",
                "published": true,
                "attributes": {
                  "size": [
                    "l",
                    "m",
                    "s"
                  ],
                  "color": [
                    "red",
                    "blue"
                  ]
                },
                "categoryIds": [
                  "62c010ebd49389ce1fc48ac9"
                ],
                "manufacturer": "ABC Industries",
                "locationIds": [
                  "62cebef175a4f7a690b8ead2"
                ],
                "countryOfOrigin": "India",
                "trending": false,
                "featuredFrom": "2022-07-15T07:22:03.556Z",
                "featuredTo": "2022-07-15T07:22:03.556Z",
                "guestCheckout": false,
                "private_product": true,
                "marketPlace": true
              }
            }
            ```
    -   **/api/products/delete**
        -   Protected route - bearer token needed
        -   Accessible only by owner
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
                "message": "Product deleted",
                "product": {
                    "id": "62c00dcad49389ce1fc48ac0",
                    "name": "Ergonomic Wooden Salad",
                    "description": "...",
                    "shortDescriptions": "...",
                    "slug": "explicabo-aspernatur-dolorem",
                    "quantity": 142,
                    "supplierId": "62b97af7190404e5c50e045d",
                    "published": true,
                    "attributes": {
                        "size": [
                            "l",
                            "m",
                            "s"
                        ],
                        "color": [
                            "red",
                            "blue"
                        ]
                    },
                    "categoryIds": [
                        "62c00b39d49389ce1fc48abd"
                    ]
                }
            }
            ```

## SKU routes

-   For admin -
    -   **/api/sku/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            slug: string, required
            quantity: number, default - 0
            productId: string, required
            supplierId: string, required
            published: boolean, default - false
            attributes: object, required, structure - {key: [...arr]}
            categoryIds: array, required
            price: number, required
            discountedPrice: number, required
            ```
        -   Successful Response -
            ```
            {
                "message": "New SKU Created",
                "sku": {
                    "id": "62c00f17d49389ce1fc48ac5",
                    "slug": "aliquid-aut-nulla",
                    "quantity": 797,
                    "productId": "62c00eb1d49389ce1fc48ac1",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "published": true,
                    "attributes": {
                        "size": "l",
                        "color": "red"
                    },
                    "categoryIds": [
                        "62c00b39d49389ce1fc48abd"
                    ],
                    "price": 966.88,
                    "discountedPrice": 962.11
                }
            }
            ```
    -   **/api/sku/bulk-create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            // req.body -
            {
              body: [
                {
                  slug: string, required
                  quantity: number, default - 0
                  productId: string, required
                  supplierId: string, required
                  published: boolean, default - false
                  attributes: object, required, structure - {key: [...arr]}
                  categoryIds: array, required
                  price: number, required
                  discountedPrice: number, required
                },
                {
                  slug: string, required
                  quantity: number, default - 0
                  productId: string, required
                  supplierId: string, required
                  published: boolean, default - false
                  attributes: object, required, structure - {key: [...arr]}
                  categoryIds: array, required
                  price: number, required
                  discountedPrice: number, required
                },
                ...
              ]
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "New SKUs Created",
              "sku": [
                {
                  "id": "62d1257dd1ec38d5d0dcbb7d",
                  "slug": "quod-corrupti-ut",
                  "quantity": 113,
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "supplierId": "62b97af7190404e5c50e045d",
                  "published": true,
                  "attributes": {
                    "size": "l",
                    "color": "red"
                  },
                  "categoryIds": [
                    "62c010ebd49389ce1fc48ac9"
                  ],
                  "price": 729.88,
                  "discountedPrice": 188.29
                },
                {
                  "id": "62d1257dd1ec38d5d0dcbb7e",
                  "slug": "facere-minus-harum",
                  "quantity": 445,
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "supplierId": "62b97af7190404e5c50e045d",
                  "published": false,
                  "attributes": {
                    "size": "m",
                    "color": "blue"
                  },
                  "categoryIds": [
                    "62c010ebd49389ce1fc48ac9"
                  ],
                  "price": 701.61,
                  "discountedPrice": 157.66
                }
              ]
            }
            ```
    -   **/api/sku**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, optional
            inStock: boolean, optional
            published: boolean, optional
            priceFrom: number, optional
            priceTo: number, optional
            supplierId: string, optional
            productId: string, optional
            categoryId: string, optional
            attributes: object, optional
            pagination: boolean, optional
            offset: number, optional
            limit: number, optional
            ```
        -   Successful Response -
            ```
            {
                "message": "SKUs found",
                "skus": {
                    "skus": [
                        {
                            "slug": "adipisci-fugit-aut",
                            "quantity": 494,
                            "published": true,
                            "attributes": {
                                "size": "l",
                                "color": "red"
                            },
                            "price": 134.9,
                            "discountedPrice": 329.13,
                            "id": "62c00f15d49389ce1fc48ac4",
                            "supplierId": "62b97af7190404e5c50e045d",
                            "categoryIds": [
                                "62c00b39d49389ce1fc48abd"
                            ]
                        },
                        {
                            "slug": "aliquid-aut-nulla",
                            "quantity": 797,
                            "published": true,
                            "attributes": {
                                "size": "l",
                                "color": "red"
                            },
                            "price": 966.88,
                            "discountedPrice": 962.11,
                            "id": "62c00f17d49389ce1fc48ac5",
                            "supplierId": "62b97af7190404e5c50e045d",
                            "categoryIds": [
                                "62c00b39d49389ce1fc48abd"
                            ]
                        }
                    ],
                    "pagination": {
                        "total_count": 3,
                        "limit": 2,
                        "offset": 1
                    }
                }
            }
            ```
    -   **/api/sku/{{skuId}}**
        -   Protected route - bearer token needed
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
                "message": "SKU found",
                "sku": [
                    {
                        "id": "62c00f17d49389ce1fc48ac5",
                        "slug": "aliquid-aut-nulla",
                        "quantity": 797,
                        "productId": "62c00eb1d49389ce1fc48ac1",
                        "supplierId": "62b97af7190404e5c50e045d",
                        "published": true,
                        "attributes": {
                            "size": "l",
                            "color": "red"
                        },
                        "categoryIds": [
                            "62c00b39d49389ce1fc48abd"
                        ],
                        "price": 966.88,
                        "discountedPrice": 962.11
                    }
                ]
            }
            ```
    -   **/api/sku/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            updateData: {
              slug: string, optional
              quantity: number, optional
              productId: string, optional
              published: boolean, optional
              attributes: object, optional
              categoryIds: array, optional
              price: number, optional
              discountedPrice: number, optional
            }
            ```
        -   Successful Response -
            ```
            {
                "message": "SKU updated",
                "sku": {
                    "id": "62c00f17d49389ce1fc48ac5",
                    "slug": "aliquid-aut-nulla",
                    "quantity": 797,
                    "productId": "62c00eb1d49389ce1fc48ac1",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "published": true,
                    "attributes": {
                        "size": "l",
                        "color": "red"
                    },
                    "categoryIds": [
                        "62c00b39d49389ce1fc48abd"
                    ],
                    "price": 966.88,
                    "discountedPrice": 962.11
                }
            }
            ```
    -   **/api/sku/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
                "message": "SKU deleted",
                "sku": {
                    "id": "62c013dad49389ce1fc48ad2",
                    "slug": "et-qui-vitae",
                    "quantity": 562,
                    "productId": "62c013d2d49389ce1fc48ad1",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "published": false,
                    "attributes": {
                        "size": "l",
                        "color": "red"
                    },
                    "categoryIds": [
                        "62c010ebd49389ce1fc48ac9"
                    ],
                    "price": 346.1,
                    "discountedPrice": 848.22
                }
            }
            ```
-   For user -

    -   **/api/sku/create**

        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            slug: string, required
            quantity: number, default - 0
            productId: string, required
            published: boolean, default - false
            attributes: object, required, structure - {key: [...arr]}
            categoryIds: array, required
            price: number, required
            discountedPrice: number, required
            ```
        -   Successful Response -
            ```
            {
                "message": "New SKU Created",
                "sku": {
                    "id": "62c00f17d49389ce1fc48ac5",
                    "slug": "aliquid-aut-nulla",
                    "quantity": 797,
                    "productId": "62c00eb1d49389ce1fc48ac1",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "published": true,
                    "attributes": {
                        "size": "l",
                        "color": "red"
                    },
                    "categoryIds": [
                        "62c00b39d49389ce1fc48abd"
                    ],
                    "price": 966.88,
                    "discountedPrice": 962.11
                }
            }
            ```

    -   **/api/sku/bulk-create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            // req.body -
            {
              body: [
                {
                  slug: string, required
                  quantity: number, default - 0
                  productId: string, required
                  supplierId: string, required
                  published: boolean, default - false
                  attributes: object, required, structure - {key: [...arr]}
                  categoryIds: array, required
                  price: number, required
                  discountedPrice: number, required
                },
                {
                  slug: string, required
                  quantity: number, default - 0
                  productId: string, required
                  supplierId: string, required
                  published: boolean, default - false
                  attributes: object, required, structure - {key: [...arr]}
                  categoryIds: array, required
                  price: number, required
                  discountedPrice: number, required
                },
                ...
              ]
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "New SKUs Created",
              "sku": [
                {
                  "id": "62d1257dd1ec38d5d0dcbb7d",
                  "slug": "quod-corrupti-ut",
                  "quantity": 113,
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "supplierId": "62b97af7190404e5c50e045d",
                  "published": true,
                  "attributes": {
                    "size": "l",
                    "color": "red"
                  },
                  "categoryIds": [
                    "62c010ebd49389ce1fc48ac9"
                  ],
                  "price": 729.88,
                  "discountedPrice": 188.29
                },
                {
                  "id": "62d1257dd1ec38d5d0dcbb7e",
                  "slug": "facere-minus-harum",
                  "quantity": 445,
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "supplierId": "62b97af7190404e5c50e045d",
                  "published": false,
                  "attributes": {
                    "size": "m",
                    "color": "blue"
                  },
                  "categoryIds": [
                    "62c010ebd49389ce1fc48ac9"
                  ],
                  "price": 701.61,
                  "discountedPrice": 157.66
                }
              ]
            }
            ```
    -   **/api/sku**
        -   Protected route - bearer token needed
        -   Accessible only by all
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, optional
            inStock: boolean, optional
            published: boolean, optional
            priceFrom: number, optional
            priceTo: number, optional
            supplierId: string, optional
            productId: string, optional
            categoryId: string, optional
            attributes: object, optional
            pagination: boolean, optional
            offset: number, optional
            limit: number, optional
            ```
        -   Successful Response -
            ```
            {
                "message": "SKUs found",
                "skus": {
                    "skus": [
                        {
                            "slug": "adipisci-fugit-aut",
                            "quantity": 494,
                            "published": true,
                            "attributes": {
                                "size": "l",
                                "color": "red"
                            },
                            "price": 134.9,
                            "discountedPrice": 329.13,
                            "id": "62c00f15d49389ce1fc48ac4",
                            "supplierId": "62b97af7190404e5c50e045d",
                            "categoryIds": [
                                "62c00b39d49389ce1fc48abd"
                            ]
                        },
                        {
                            "slug": "aliquid-aut-nulla",
                            "quantity": 797,
                            "published": true,
                            "attributes": {
                                "size": "l",
                                "color": "red"
                            },
                            "price": 966.88,
                            "discountedPrice": 962.11,
                            "id": "62c00f17d49389ce1fc48ac5",
                            "supplierId": "62b97af7190404e5c50e045d",
                            "categoryIds": [
                                "62c00b39d49389ce1fc48abd"
                            ]
                        }
                    ],
                    "pagination": {
                        "total_count": 3,
                        "limit": 2,
                        "offset": 1
                    }
                }
            }
            ```
    -   **/api/sku/{{skuId}}**
        -   Protected route - bearer token needed
        -   Accessible only by all
        -   Accepted method - `GET`
        -   Successful Response -
            ```
            {
                "message": "SKU found",
                "sku": [
                    {
                        "id": "62c00f17d49389ce1fc48ac5",
                        "slug": "aliquid-aut-nulla",
                        "quantity": 797,
                        "productId": "62c00eb1d49389ce1fc48ac1",
                        "supplierId": "62b97af7190404e5c50e045d",
                        "published": true,
                        "attributes": {
                            "size": "l",
                            "color": "red"
                        },
                        "categoryIds": [
                            "62c00b39d49389ce1fc48abd"
                        ],
                        "price": 966.88,
                        "discountedPrice": 962.11
                    }
                ]
            }
            ```
    -   **/api/sku/update**
        -   Protected route - bearer token needed
        -   Accessible only by owner
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            updateData: {
              slug: string, optional
              quantity: number, optional
              productId: string, optional
              published: boolean, optional
              attributes: object, optional
              categoryIds: array, optional
              price: number, optional
              discountedPrice: number, optional
            }
            ```
        -   Successful Response -
            ```
            {
                "message": "SKU updated",
                "sku": {
                    "id": "62c00f17d49389ce1fc48ac5",
                    "slug": "aliquid-aut-nulla",
                    "quantity": 797,
                    "productId": "62c00eb1d49389ce1fc48ac1",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "published": true,
                    "attributes": {
                        "size": "l",
                        "color": "red"
                    },
                    "categoryIds": [
                        "62c00b39d49389ce1fc48abd"
                    ],
                    "price": 966.88,
                    "discountedPrice": 962.11
                }
            }
            ```
    -   **/api/sku/delete**
        -   Protected route - bearer token needed
        -   Accessible only by owner
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
                "message": "SKU deleted",
                "sku": {
                    "id": "62c013dad49389ce1fc48ad2",
                    "slug": "et-qui-vitae",
                    "quantity": 562,
                    "productId": "62c013d2d49389ce1fc48ad1",
                    "supplierId": "62b97af7190404e5c50e045d",
                    "published": false,
                    "attributes": {
                        "size": "l",
                        "color": "red"
                    },
                    "categoryIds": [
                        "62c010ebd49389ce1fc48ac9"
                    ],
                    "price": 346.1,
                    "discountedPrice": 848.22
                }
            }
            ```

## Location routes

-   For admin -
    -   **/api/location/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            title: string, required
            address: string, required
            pincode: string, required
            state: string, required
            country: string, required
            tenantId: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "New Location Created",
              "location": {
                "id": "62cd627b28f6c3643bf2cf46",
                "title": "vero ut et",
                "address": "7595 Aliyah Parks",
                "pincode": "170125",
                "state": "Watsonborough",
                "country": "Peru",
                "tenantId": "62b97af7190404e5c50e045d",
                "tenant": {
                  "id": "62b97af7190404e5c50e045d",
                  "name": "Will, Watsica and Reilly",
                  "description": "...",
                  "companyId": "62b93b57190404e5c50e045c"
                }
              }
            }
            ```
    -   **/api/location**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Query format -
            ```
            id: string, optional
            query: string, optional, will be searched in title and address
            pincode: string, optional
            state: string, optional
            country: string, optional
            tenantId: string, optional
            paginated: boolean, optional
            count: integer, required if paginated is true
            offset: integer, required if paginated is true
            ```
        -   Successful Response -
            ```
            {
              "message": "Locations found",
              "locations": {
                "locations": [
                  {
                    "id": "62cd627b28f6c3643bf2cf46",
                    "title": "vero ut et",
                    "address": "7595 Aliyah Parks",
                    "pincode": "170125",
                    "state": "Watsonborough",
                    "country": "Peru",
                    "tenantId": "62b97af7190404e5c50e045d"
                  }
                ],
                "pagination": {
                  "offset": 0,
                  "count": 2,
                  "total_count": 1
                }
              }
            }
            ```
    -   **/api/location/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            {
              id: string, required
              title: string, optional
              address: string, optional
              pincode: string, optional
              state: string, optional
              country: string, optional
              tenantId: string, optional
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "location updated",
              "location": {
                "id": "62cd627b28f6c3643bf2cf46",
                "title": "New location",
                "address": "add",
                "pincode": "170125",
                "state": "Watsonborough",
                "country": "Peru",
                "tenantId": "62b97af7190404e5c50e045d",
                "tenant": {
                  "id": "62b97af7190404e5c50e045d",
                  "name": "Will, Watsica and Reilly",
                  "description": "...",
                  "companyId": "62b93b57190404e5c50e045c"
                }
              }
            }
            ```
    -   **/api/location/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Location deleted",
              "tenant": {
                "id": "62cd627b28f6c3643bf2cf46",
                "title": "New location",
                "address": "add",
                "pincode": "170125",
                "state": "Watsonborough",
                "country": "Peru",
                "tenantId": "62b97af7190404e5c50e045d"
              }
            }
            ```
-   For user -
    -   **/api/location/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            title: string, required
            address: string, required
            pincode: string, required
            state: string, required
            country: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "New Location Created",
              "location": {
                "id": "62cd627b28f6c3643bf2cf46",
                "title": "vero ut et",
                "address": "7595 Aliyah Parks",
                "pincode": "170125",
                "state": "Watsonborough",
                "country": "Peru",
                "tenantId": "62b97af7190404e5c50e045d",
                "tenant": {
                  "id": "62b97af7190404e5c50e045d",
                  "name": "Will, Watsica and Reilly",
                  "description": "...",
                  "companyId": "62b93b57190404e5c50e045c"
                }
              }
            }
            ```
    -   **/api/location**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Query format -
            ```
            id: string, optional
            query: string, optional, will be searched in title and address
            pincode: string, optional
            state: string, optional
            country: string, optional
            paginated: boolean, optional
            count: integer, required if paginated is true
            offset: integer, required if paginated is true
            ```
        -   Successful Response -
            ```
            {
              "message": "Locations found",
              "locations": {
                "locations": [
                  {
                    "id": "62cd627b28f6c3643bf2cf46",
                    "title": "vero ut et",
                    "address": "7595 Aliyah Parks",
                    "pincode": "170125",
                    "state": "Watsonborough",
                    "country": "Peru",
                    "tenantId": "62b97af7190404e5c50e045d"
                  }
                ],
                "pagination": {
                  "offset": 0,
                  "count": 2,
                  "total_count": 1
                }
              }
            }
            ```
    -   **/api/location/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            {
              id: string, required
              title: string, optional
              address: string, optional
              pincode: string, optional
              state: string, optional
              country: string, optional
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "location updated",
              "location": {
                "id": "62cd627b28f6c3643bf2cf46",
                "title": "New location",
                "address": "add",
                "pincode": "170125",
                "state": "Watsonborough",
                "country": "Peru",
                "tenantId": "62b97af7190404e5c50e045d",
                "tenant": {
                  "id": "62b97af7190404e5c50e045d",
                  "name": "Will, Watsica and Reilly",
                  "description": "...",
                  "companyId": "62b93b57190404e5c50e045c"
                }
              }
            }
            ```
    -   **/api/location/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Location deleted",
              "tenant": {
                "id": "62cd627b28f6c3643bf2cf46",
                "title": "New location",
                "address": "add",
                "pincode": "170125",
                "state": "Watsonborough",
                "country": "Peru",
                "tenantId": "62b97af7190404e5c50e045d"
              }
            }
            ```

## Product Import routes

-   For admin -
    -   **/api/product_imports/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            productId: string, required
            tenantId: string, required
            status: boolean, required
            override: object, default - {}
            ```
        -   Successful Response -
            ```
            {
              "message": "New Product Import Created",
              "productImport": {
                "id": "62d4fca697014ba74a22aa3b",
                "tenantId": "62b97af7190404e5c50e045d",
                "productId": "62d119f9d1ec38d5d0dcbb78",
                "status": true,
                "override": {}
              }
            }
            ```
    -   **/api/product_imports**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Query format -
            ```
            id: string, optional
            tenantId: string, optional
            productId: string, optional
            status: boolean
            ```
        -   Successful Response -
            ```
            {
              "message": "Product Imports found",
              "productImports": [
                {
                  "id": "62d4fc9897014ba74a22aa3a",
                  "tenantId": "62b97af7190404e5c50e045d",
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "status": true,
                  "override": {}
                },
                {
                  "id": "62d4fca697014ba74a22aa3b",
                  "tenantId": "62b97af7190404e5c50e045d",
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "status": true,
                  "override": {}
                },
                {
                  "id": "62d4fcb197014ba74a22aa3c",
                  "tenantId": "62b97af7190404e5c50e045d",
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "status": false,
                  "override": {}
                }
              ]
            }
            ```
    -   **/api/product_imports/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            updateData: {
              productId: string, optional
              tenantId: string, optional
              status: boolean, optional
              override: object, optional
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "Product Import updated",
              "updatedProductImport": {
                "id": "62d4fcb197014ba74a22aa3c",
                "tenantId": "62b97af7190404e5c50e045d",
                "productId": "62d119f9d1ec38d5d0dcbb78",
                "status": false,
                "override": {}
              }
            }
            ```
    -   **/api/product_imports/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Product Import deleted",
              "productImport": {
                "id": "62d4fcb197014ba74a22aa3c",
                "tenantId": "62b97af7190404e5c50e045d",
                "productId": "62d119f9d1ec38d5d0dcbb78",
                "status": false,
                "override": {}
              }
            }
            ```
-   For user -
    -   **/api/product_imports/create**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            productId: string, required
            status: boolean, required
            override: object, default - {}
            ```
        -   Successful Response -
            ```
            {
              "message": "New Product Import Created",
              "productImport": {
                "id": "62d4fcb197014ba74a22aa3c",
                "tenantId": "62b97af7190404e5c50e045d",
                "productId": "62d119f9d1ec38d5d0dcbb78",
                "status": false,
                "override": {}
              }
            }
            ```
    -   **/api/product_imports**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Query format -
            ```
            id: string, optional
            tenantId: string, optional
            productId: string, optional
            status: boolean
            ```
        -   Successful Response -
            ```
            {
              "message": "Product Imports found",
              "productImports": [
                {
                  "id": "62d4fc9897014ba74a22aa3a",
                  "tenantId": "62b97af7190404e5c50e045d",
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "status": true,
                  "override": {}
                },
                {
                  "id": "62d4fca697014ba74a22aa3b",
                  "tenantId": "62b97af7190404e5c50e045d",
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "status": true,
                  "override": {}
                },
                {
                  "id": "62d4fcb197014ba74a22aa3c",
                  "tenantId": "62b97af7190404e5c50e045d",
                  "productId": "62d119f9d1ec38d5d0dcbb78",
                  "status": false,
                  "override": {}
                }
              ]
            }
            ```
    -   **/api/product_imports/update**
        -   Protected route - bearer token needed
        -   Accepted method - `POST`
        -   Body format -
            ```
            id: string, required
            updateData: {
              productId: string, optional
              status: boolean, optional
              override: object, optional
            }
            ```
        -   Successful Response -
            ```
            {
              "message": "Product Import updated",
              "updatedProductImport": {
                "id": "62d4fcb197014ba74a22aa3c",
                "tenantId": "62b97af7190404e5c50e045d",
                "productId": "62d119f9d1ec38d5d0dcbb78",
                "status": false,
                "override": {}
              }
            }
            ```
    -   **/api/product_imports/delete**
        -   Protected route - bearer token needed
        -   Accepted method - `DELETE`
        -   Body format -
            ```
            id: string, required
            ```
        -   Successful Response -
            ```
            {
              "message": "Product deleted",
              "productImport": {
                "id": "62d5076797014ba74a22aa3d",
                "tenantId": "62b97af7190404e5c50e045d",
                "productId": "62d119f9d1ec38d5d0dcbb78",
                "status": true,
                "override": {}
              }
            }
            ```
