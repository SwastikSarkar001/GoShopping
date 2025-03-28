import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserCredentialsType, UserSignInType } from "../../components/Authentication/AuthenticationPage"
import axios from "axios"
import performProtectedRequest from "../../utilities/performProtectedRequest"

type User = {
  data: {
    firstName: string,
    middleName?: string,
    lastName: string,
    email: string,
    phone: string,
    city: string,
    state: string,
    country: string,
  },
  isAuthenticated: boolean
  loading: boolean
}

export const defaultUserProfile: User = {
  data: {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: ''
  },
  isAuthenticated: false,
  loading: true
}

export const userSlice = createSlice({
  name: 'userdata',
  initialState: defaultUserProfile,
  reducers: {
    setFirstName: (state, action: PayloadAction<UserData['firstName']>) => {
      state.data.firstName = action.payload;
    },
    setMiddleName: (state, action: PayloadAction<UserData['middleName'] | undefined>) => {
      state.data.middleName = action.payload
    },
    setLastName: (state, action: PayloadAction<UserData['lastName']>) => {
      state.data.lastName = action.payload
    },
    setEmail: (state, action: PayloadAction<UserData['email']>) => {
      state.data.email = action.payload
    },
    setPhone: (state, action: PayloadAction<UserData['phone']>) => {
      state.data.phone = action.payload
    },
    setCity: (state, action: PayloadAction<UserData['city']>) => {
      state.data.city = action.payload
    },
    setState: (state, action: PayloadAction<UserData['state']>) => {
      state.data.state = action.payload
    },
    setCountry: (state, action: PayloadAction<UserData['country']>) => {
      state.data.country = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createUserAccount.pending, (state) => {
        state.loading = true
      })
      .addCase(createUserAccount.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.loading = false
        state.data = action.payload
      })
      .addCase(createUserAccount.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
      })
      .addCase(signInUser.pending, (state) => {
        state.loading = true
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.loading = false
        state.data = action.payload
      })
      .addCase(signInUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
      })
      .addCase(signOutUser.pending, (state) => {
        state.loading = true
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.loading = false
        state.data = defaultUserProfile.data
      })
      .addCase(signOutUser.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
      })
      .addCase(getInitUserProfile.pending, (state) => {
        state.loading = true
      })
      .addCase(getInitUserProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true
        state.loading = false
        state.data = action.payload
      })
      .addCase(getInitUserProfile.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
      })
  }
})

/**
 * Creates a new user account by dispatching an asynchronous action.
 *
 * This function sends a POST request to the server with the provided user registration
 * data. It maps the incoming credentials to the expected format and handles the server response:
 *
 * - If the server returns a status of 201, the user account has been created successfully,
 *   and the client's user data is extracted and returned.
 * - If the server returns a status of 409, it indicates a conflict (e.g., duplicate account),
 *   and an error is thrown containing the server's message.
 * - If the server returns a status of 400, it indicates a bad request, and an error is thrown
 *   with the corresponding message.
 * - For any other status code, an unexpected error is thrown with the server's error message.
 *
 * @param userdata - An object containing the user's credentials, including first name,
 *                   middle name, last name, email, phone, city, state, country, and password.
 * @returns A promise that resolves with the user's data (firstName, middleName, lastName, email,
 *          phone, city, state, country) if the account creation is successful.
 * @throws Will throw an error if the server responds with a 409, 400, or any unexpected status code.
 */
export const createUserAccount = createAsyncThunk(
  'userdata/createUserAccount',
  async (userdata: UserCredentialsType) => {
    const finalData = {
      firstname: userdata.fname,
      middlename: userdata.mname,
      lastname: userdata.lname,
      email: userdata.email,
      phone: userdata.phone,
      sitename: userdata.sitename,
      city: userdata.city,
      state: userdata.state,
      country: userdata.country,
      password: userdata.password,
    }
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/register`,
      finalData,
      {
        withCredentials: true,
        validateStatus: (status) => status === 201 || status === 409 || status === 400
      }
    )
    if (response.status === 201) {
      const responseData = response.data.data[0].clientData
      return {
        firstName: responseData.firstname,
        middleName: responseData.middlename,
        lastName: responseData.lastname,
        email: responseData.email,
        phone: responseData.phone,
        city: responseData.city,
        state: responseData.state,
        country: responseData.country
      } as UserData
    }
    else if (response.status === 409) {
      throw new Error(response.data.message)
    }
    else if (response.status === 400) {
      throw new Error(response.data.message)
    }
    else {
      throw new Error(`An unexpected error occurred while registering. Error: ${response.data.message}`)
    }
  }
)

/**
 * Signs in a user by dispatching an asynchronous action.
 *
 * This function sends a POST request to the server with the provided user sign-in
 * data. It maps the incoming credentials to the expected format and handles the server response:
 *
 * - If the server returns a status of 200, the user has signed in successfully,
 *   and the client's user data is extracted and returned.
 * - If the server returns a status of 401, it indicates an unauthorized request
 *   (e.g., incorrect email or password), and an error is thrown containing the server's message.
 * - For any other status code, an unexpected error is thrown with the server's error message.
 *
 * @param userdata - An object containing the user's sign-in credentials, including email and password.
 * @returns A promise that resolves with the user's data (firstname, middlename, lastname, email,
 *          phone, city, state, country) if the sign-in is successful.
 * @throws Will throw an error if the server responds with a 401 or any unexpected status code.
 */
export const signInUser = createAsyncThunk(
  'userdata/signInUser',
  async (userdata: UserSignInType) => {
    const finalData = {
      email: userdata.email,
      password: userdata.password
    }
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/signin`,
      finalData,
      {
        withCredentials: true,
        validateStatus: (status) => status === 200 || status === 401
      }
    )
    if (response.status === 200) {
      const responseData = response.data.data[0].clientData
      return {
        firstName: responseData.firstname,
        middleName: responseData.middlename,
        lastName: responseData.lastname,
        email: responseData.email,
        phone: responseData.phone,
        city: responseData.city,
        state: responseData.state,
        country: responseData.country
      } as UserData
    }
    else if (response.status === 401) {
      if ((response.data.message as string).includes('Invalid email or password')) {
        throw new Error('Incorrect email or password. Please try again.')
      }
      else {
        throw new Error(response.data.message)
      }
    }
    else {
      throw new Error(`An unexpected error occurred while signing in. Error: ${response.data.message}`)
    }
  }
)

export const signOutUser = createAsyncThunk(
  'userdata/signOutUser',
  async () => {
    const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/signout`,
      {
        withCredentials: true,
        validateStatus: (status) => status === 204 || status === 401
      }
    )
    if (response.status === 204) {
      return defaultUserProfile
    }
    else if (response.status === 401) {
      throw new Error('Unauthorized request. Please sign in to continue.')
    }
    else {
      throw new Error(`An unexpected error occurred while signing out. Error: ${response.data.message}`)
    }
  }
)

async function initProfile() {
  const data = await performProtectedRequest(() => 
    axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/user`, {
      withCredentials: true,
      validateStatus: (status) => status === 200 || status === 401
    })
  )

  // Transform the returned data as needed.
  const user = data.data[0]
  return {
    firstName: user.firstname,
    middleName: user.middlename,
    lastName: user.lastname,
    email: user.email,
    phone: user.phone,
    city: user.city,
    state: user.state,
    country: user.country
  } as UserData
}

// async function initProfile() {
//   const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/user`,
//     {
//       withCredentials: true,
//       validateStatus: (status) => status === 200 || status === 401
//     }
//   )

//   /* Valid access token */
//   if (response.status === 200) {
//     const responseData = response.data.data[0]
//     return {
//       firstName: responseData.firstname,
//       middleName: responseData.middlename,
//       lastName: responseData.lastname,
//       email: responseData.email,
//       phone: responseData.phone,
//       city: responseData.city,
//       state: responseData.state,
//       country: responseData.country
//     } as UserData
//   }

//   /* Access Token expires or not provided */
//   else if (response.status === 401) {
//     const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/refresh`,
//       {
//         withCredentials: true,
//         validateStatus: (status) => status === 200 || status === 401
//       }
//     )

//     /* Valid refresh token and access token regenerated */
//     if (res.status === 200) {
//       return await initProfile()
//     }

//     /* Refresh token expires or not provided */
//     else if (res.status === 401) {
//       throw new Error(`Session has expired. Please sign in to continue.`)
//     }

//     /* Unexpected error while refreshing token */
//     else {
//       throw new Error(`An unexpected error occurred while refreshing the token.`)
//     }
//   }

//   /* Unexpected error while fetching user data */
//   else {
//     throw new Error(`An unexpected error occurred while fetching user data.`)
//   }
// }

export const getInitUserProfile = createAsyncThunk(
  'userdata/getInitUserProfile',
  async () => {
    return await initProfile()
  }
)

export const {
  setFirstName,
  setMiddleName,
  setLastName,
  setEmail,
  setPhone,
  setCity,
  setState,
  setCountry
} = userSlice.actions

export type UserData = typeof defaultUserProfile['data']
export default userSlice.reducer