import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Navbar from "../Features/Navbar";
import { Button, CheckBox, InputEmail, InputPassword, InputText } from "../Authentication/InputElements";
import { UserSVG } from "../Authentication/Icons";
import Dialog, { DialogActionBtn, DialogBody, DialogCloseBtn, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../Utilities/Dialog";

type UserInfo = {
  slno: number;
  fname: string;
  lname: string;
  email: string;
  status: 0 | 1;
}

type CustomerDataType = {
  slno: number,
  customer_id: number,
  module_id: number,
  tier_id: number,
  payment_date: string,
  subscription_status: "Monthly" | "Yearly",
  user_status: number,
  expiry: number,
  featurenum: number,
  featureid: string,
  title: string,
  description: string,
  price_inr_pupm: string,
  total_modules: string[],
  roles: string[]
}

export default function CreateUser() {
  /** State for all users of customer */
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roles: [] as string[],
    modules: [] as string[]
  });
  
  /** Check if all fields are empty */
  const isEmpty = formData.firstName === "" && formData.lastName === "" && formData.email === "" && formData.password === "" && formData.roles.length === 0 && formData.modules.length === 0

  /** Check if all required fields are filled */
  const hasFilled = !!(formData.firstName && formData.lastName && formData.email && formData.password && formData.roles.length > 0 && formData.modules.length > 0)

  const [roles, setRoles] = useState<string[]>([]);
  const [modules, setModules] = useState<string[]>([]);

  const customerid = 1

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, group: 'roles' | 'modules') => {
    const { checked, value } = e.target;
    
    setFormData((prevData) => {
      const updatedArray = checked
      ? [...prevData[group], value]
      : prevData[group].filter((item) => item !== value);
      
      return { ...prevData, [group]: updatedArray };
    });
  };
  
  const handleSubmit = async () => {
    console.log("Submitted Data:", formData);

    await axios.post("http://localhost:8000/users",
      formData,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    // Reset form data after submission
    setFormData({
      customer_id: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roles: [],
      modules: []
    });

    setIsSubmitted(true);
  };

  const handleStatusChange = async (userid: number, status: number) => {
    // console.log("userid", userid);
    // console.log("status", status);

    await axios.get(`http://localhost:8000/change_user_status`, {
      params: {
        userid: userid,
        status: status
      }
    });

    setIsSubmitted(true);
    alert("Users Status Changed!!");
  }

  const getCreatedUsers = async (userid: number) => {
    const response = await axios.get(`http://localhost:8000/get_created_users`, {
      params: {
        userid: userid
      }
    });
    const data = response.data;
    setAllUsers(data);
  }
  
  const getRolesModules = async (arr: CustomerDataType[]) => {
    if (!Array.isArray(arr)) return;

    const modSet = new Set<string>();
    const rolSet = new Set<string>();

    for (const item of arr) {
      if (item?.total_modules) {
        for (const modname of item.total_modules) {
          modSet.add(modname);
        }
      }

      if (item?.roles) {
        for (const rolname of item.roles) {
          rolSet.add(rolname);
        }
      }
    }

    setRoles([...rolSet]);  // Convert Set back to array
    setModules([...modSet]); // Convert Set back to array
  };

  const getUserRoles = useCallback(async (customer_id: string) => {
    const response = await axios.get(`http://localhost:8000/get__user_roles`, {
      params: {
        cusId: customer_id
      }
    })
    const data = response.data as CustomerDataType[];
    getRolesModules(data);
  }, [])

  const updateCustomerId = (newId: string) => {
    setFormData((prevData) => ({
      ...prevData,
      customer_id: newId
    }));
  };

  /** Fetching all data (users created and available roles and modules of the customer) */
  useEffect(() => {
    getCreatedUsers(customerid);
    getUserRoles(customerid.toString());
  }, [getUserRoles]);

  useEffect(() => {
    if (isSubmitted) {
      getCreatedUsers(customerid);
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  useEffect(() => {
    if (formData.customer_id === "" || formData.customer_id !== customerid.toString()) {
      updateCustomerId(customerid.toString());
    }
  }, [formData])
  
  /** Pagination and searching logic begins */

  const [searchableValue, setSearchableValue] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<UserInfo[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const changeSearchableValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchableValue(e.target.value)
  }

  useEffect(() => {
    const searchValue = searchableValue.toLowerCase()
    setFilteredUsers(
      allUsers.filter(user => {
        return user.fname.toLowerCase().includes(searchValue) || user.lname.toLowerCase().includes(searchValue) || user.email.toLowerCase().includes(searchValue)
      })
    )
    setCurrentPage(1)
  }, [searchableValue, allUsers])

  const maxViewableUsersPerPage = 10
  const pages = Math.ceil(filteredUsers.length / maxViewableUsersPerPage)
  const viewPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }
  const viewNext = () => {
    if (currentPage <= pages) {
      setCurrentPage(prev => prev + 1)
    }
  }
  const firstUserIndex = maxViewableUsersPerPage * (currentPage - 1) + 1  > filteredUsers.length ? filteredUsers.length : maxViewableUsersPerPage * (currentPage - 1) + 1
  const lastUserIndex = maxViewableUsersPerPage * currentPage > filteredUsers.length ? filteredUsers.length : maxViewableUsersPerPage * currentPage
  const viewableUsers = filteredUsers.slice((firstUserIndex - 1) >= 0 ? firstUserIndex - 1 : 0, lastUserIndex)

  /** Pagination and searching logic ends */

  return (
    <div>
      <Navbar />
      <div className="text-text p-8 flex flex-col gap-2">
        <h1 className="text-3xl font-source-serif flex items-center gap-4">
          Users
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1em]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        </h1>
        <p className="text-gray-500">Manage all of your users</p>
        <Dialog onClose={
          () => {
            if (isEmpty) {
              return true
            }
            else {
              const confirmClose = confirm("Are you sure you want to close this dialog? Your changes will not be saved.")
              if (confirmClose) {
                setFormData({
                  customer_id: "",
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  roles: [],
                  modules: []
                });
                return true
              }
              else return false
            }
          }
        }>
          <DialogTrigger className="mt-2 self-end" asChild>
            <Button
              id="add-user"
              text="Add User"
              className="w-max text-background bg-text dark:hover:bg-blue-400 dark:focus-within:bg-blue-400"
              Icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} className="size-[1.2em] stroke-background">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              }
            />
          </DialogTrigger>
          <DialogContent className="w-[60%]">
            <DialogHeader>
              Add a new user
            </DialogHeader>
            <DialogBody>
              <form onSubmit={e => e.preventDefault()} className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputText
                    id='firstName'
                    name='firstName'
                    label='First Name'
                    inputClassName="text-text"
                    data={formData.firstName}
                    changeData={handleInputChange}
                    Logo={<UserSVG />}
                    required
                  />
                  <InputText
                    id='lastName'
                    name='lastName'
                    label='Last Name'
                    inputClassName="text-text"
                    data={formData.lastName}
                    changeData={handleInputChange}
                    Logo={<UserSVG />}
                    required
                  />
                  <InputEmail
                    id='email'
                    name='email'
                    label='New Email Address'
                    data={formData.email}
                    inputClassName="text-text"
                    changeData={handleInputChange}
                  />
                  <InputPassword
                    id='password'
                    name='password'
                    label='Create New Password'
                    inputClassName="text-text"
                    data={formData.password}
                    changeData={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="px-4 *:not-first:justify-self-start *:not-first:mb-1">
                    <h2 className='text-2xl mb-1 text-center font-source-serif'>Roles</h2>
                    {
                      roles && roles.map(
                        (role, i) => {
                          return (
                            <CheckBox
                              key={i}
                              id={`role-${role}`}
                              label={role}
                              inputClassName={`dark:peer-focus-visible:outline-white ${formData.roles.includes(role) ? "stroke-green-600" : "!stroke-text"}`}
                              value={role}
                              checked={formData.roles.includes(role)}
                              toggler={e => handleCheckboxChange(e, "roles")}
                            />
                          )
                        }
                      )
                    }
                  </div>
                  <div className="px-4 *:not-first:justify-self-start *:not-first:mb-1">
                    <h2 className='text-2xl mb-1 text-center font-source-serif'>Modules</h2>
                    {
                      modules && modules.map((module, i) => {
                      return (
                        <CheckBox
                          key={i}
                          id={`role-${module}`}
                          label={module}
                          inputClassName={`dark:peer-focus-visible:outline-white ${formData.modules.includes(module) ? "stroke-green-600" : "!stroke-text"}`}
                          value={module}
                          checked={formData.modules.includes(module)}
                          toggler={e => handleCheckboxChange(e, "modules")}
                        />
                      )
                      })
                    }
                  </div>
                </div>
              </form>
            </DialogBody>
            <DialogFooter className="flex *:w-1/2 gap-4">
              <DialogCloseBtn className="flex gap-2 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} className="size-[1em] stroke-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <div>Cancel</div>
              </DialogCloseBtn>
              <DialogActionBtn disabled={!hasFilled} onClick={handleSubmit} className="flex gap-2 items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} className="size-[1em] stroke-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <div>Save user</div>
              </DialogActionBtn>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 mt-4">
          <div className="flex justify-between p-4 items-center text-sm gap-2 flex-wrap">
            <label htmlFor='search-users' className="border border-slate-300/90 flex grow items-center dark:border-slate-700 rounded-lg md:w-[30%] px-4 py-2 gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} className="size-[1.25em] stroke-slate-400 dark:stroke-slate-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                <circle cx={10} cy={10} r={8} />
              </svg>
              <input
                type="search"
                id="search-users"
                className="grow text-text outline-0"
                placeholder="Who are you looking for?"
                value={searchableValue}
                onChange={changeSearchableValue}
              />
            </label>
            <div className="flex items-center gap-1 md:gap-4 *:p-2 *:disabled:cursor-not-allowed *:disabled:text-gray-400 *:transition-colors *:rounded-lg *:not-disabled:hover:bg-slate-200 *:dark:not-disabled:hover:bg-slate-800">
              <div>
                Users {firstUserIndex}-{lastUserIndex} of {filteredUsers.length}
              </div>
              <button onClick={viewPrevious} disabled={currentPage === 1} className="cursor-pointer disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1.2em]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button onClick={viewNext} disabled={currentPage === pages} className="cursor-pointer disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1.2em]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar">
            <table className="w-full text-left table-auto rounded-t-2xl">
              <thead>
                <tr className="first:rounded-tl-2xl">
                  <th scope="col" className="p-4 border-t-2 border-b border-slate-400/30 dark:border-slate-600 bg-slate-50 transition-colors dark:bg-slate-900">
                    <p className="block text-sm leading-none text-text font-bold">
                      <input type="checkbox" name="" id="" />
                    </p>
                  </th>
                  <th scope="col" className="p-4 border-t-2 border-b border-slate-400/30 dark:border-slate-600 bg-slate-50 transition-colors dark:bg-slate-900">
                    <p className="block text-sm leading-none text-text font-bold">
                      Serial
                    </p>
                  </th>
                  <th scope="col" className="p-4 border-t-2 border-b border-slate-400/30 dark:border-slate-600 bg-slate-50 transition-colors dark:bg-slate-900">
                    <p className="block text-sm leading-none text-text font-bold">
                      Email
                    </p>
                  </th>
                  <th scope="col" className="p-4 border-t-2 border-b border-slate-400/30 dark:border-slate-600 bg-slate-50 transition-colors dark:bg-slate-900">
                    <p className="block text-sm leading-none text-text font-bold">
                      First Name
                    </p>
                  </th>
                  <th scope="col" className="p-4 border-t-2 border-b border-slate-400/30 dark:border-slate-600 bg-slate-50 transition-colors dark:bg-slate-900">
                    <p className="block text-sm leading-none text-text font-bold">
                      Last Name
                    </p>
                  </th>
                  <th scope="col" className="p-4 border-t-2 border-b border-slate-400/30 dark:border-slate-600 bg-slate-50 transition-colors dark:bg-slate-900">
                    <p className="block text-sm leading-none text-text font-bold">
                      Change Status
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  viewableUsers.length > 0 ?
                  viewableUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                      <td className={`p-4 ${index !== viewableUsers.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                        <input type="checkbox" name="" id="" />
                      </td>
                      <th scope="row" className={`p-4 ${index !== viewableUsers.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                        <p className="block text-sm text-text">
                          {user.slno}
                        </p>
                      </th>
                      <td className={`p-4 ${index !== viewableUsers.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                        <p className="block text-sm text-text">
                          {user.email}
                        </p>
                      </td>
                      <td className={`p-4 ${index !== viewableUsers.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                        <p className="block text-sm text-text">
                          {user.fname}
                        </p>
                      </td>
                      <td className={`p-4 ${index !== viewableUsers.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                        <p className="block text-sm text-text">
                          {user.lname}
                        </p>
                      </td>
                      <td className={`p-2 ${index !== viewableUsers.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                        <button
                          className={`rounded-lg p-2 pl-4 text-white flex items-center gap-2 w-full text-left ${user.status === 1 ? 'bg-red-500' : 'bg-green-500'}`}
                          onClick={() => confirm(`${user.status === 1 ? 'Dea' : 'A'}ctivate status of user ${user.slno}?`) && handleStatusChange(user.slno, user.status === 0 ? 1 : 0)}
                        >
                          {
                            user.status === 1 ?
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} className="size-[1em] stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                              </svg>

                              <div>Deactivate</div>
                            </> :
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} className="size-[1em] stroke-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                              <div>Activate</div>
                            </>
                          }
                        </button>
                      </td>
                    </tr>
                  )) :
                  <tr>
                    <td className="p-4 text-center text-sm text-gray-400" colSpan={6}>
                      No users found
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}