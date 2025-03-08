import axios from "axios";
import { useEffect, useReducer, useRef, useState } from "react";
import Navbar from "../Features/Navbar";
import { Button, CheckBox, InputEmail, InputPassword, InputText } from "../Authentication/InputElements";
import { UserSVG } from "../Authentication/Icons";
import Dialog, { DialogActionBtn, DialogBody, DialogCloseBtn, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../Utilities/Dialog";
import { useAppSelector } from "../../states/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BiUserCheck, BiUserX } from "react-icons/bi";
import performProtectedRequest from "../../utilities/performProtectedRequest";

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
  /** Check if user data is loaded */
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated)

  // const user = useAuth()
  const navigate = useNavigate()
  const loading = useAppSelector(state => state.user.loading)
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/auth', { replace: true })
      }
    }
  }, [isAuthenticated, loading])  // eslint-disable-line

  /** State for all users of customer */
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
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
    await performProtectedRequest(
      () =>
        axios.post("http://localhost:8000/users",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          },
          validateStatus: (status) => status === 200 || status === 401
        }
      )
    )

    // Reset form data after submission
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      roles: [],
      modules: []
    });

    setIsSubmitted(true);
  };

  const handleStatusChange = async (userids: number[], status: number) => {
    const promises = userids.map(userid =>
      axios.get(`http://localhost:8000/change_user_status`, {
        params: {
          userid: userid,
          status: status
        }
      })
    );
    await Promise.all(promises);
  };

  const activateStatuses = async () => {
    const userids = allUsers
      .filter(user => childChecked[user.slno] && user.status === 0)
      .map(user => user.slno);
    await handleStatusChange(userids, 1);
    setIsSubmitted(true);
  };

  const deactivateStatuses = async () => {
    const userids = allUsers
      .filter(user => childChecked[user.slno] && user.status === 1)
      .map(user => user.slno);
    await handleStatusChange(userids, 0);
    setIsSubmitted(true);
  };

  const getCreatedUsers = async () => {
    if (!isAuthenticated) return;
    const response = await performProtectedRequest(
      () => axios.get(`http://localhost:8000/get_created_users`, {
        withCredentials: true,
        validateStatus: (status) => status === 200 || status === 401
      })
    )
    const data = response as UserInfo[];
    setAllUsers(data);
  }

  const refreshUsers = () => getCreatedUsers().then(() => setSearchableValue(''))
  
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

  const getUserRoles = async () => {
    if (!isAuthenticated) return;
    const response = await performProtectedRequest(
      () => axios.get(`http://localhost:8000/get__user_roles`, {
        withCredentials: true,
        validateStatus: (status) => status === 200 || status === 401
      })
    )
    const data = response as CustomerDataType[];
    getRolesModules(data);
  }

  /** Fetching all data (users created and available roles and modules of the customer) */
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        await getCreatedUsers();
        await getUserRoles();
      }
    };
    fetchData();
  }, [isAuthenticated]);  // eslint-disable-line

  useEffect(() => {
    if (isSubmitted) {
      getCreatedUsers();
      setIsSubmitted(false);
    }
  }, [isSubmitted]);  // eslint-disable-line
  

  /** Pagination and searching logic begins */

  const [searchableValue, setSearchableValue] = useState("")

  /** All users that match the search value */
  const filteredUsers = allUsers.filter(
    user => {
      const searchValue = searchableValue.toLowerCase()
      return user.fname.toLowerCase().includes(searchValue) || user.lname.toLowerCase().includes(searchValue) || user.email.toLowerCase().includes(searchValue)      
    }
  )

  const [currentPage, setCurrentPage] = useState(1)

  /** Function to change the search value */
  const changeSearchableValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchableValue(e.target.value)
  }

  /** Maximum number of users that can be viewed on a single page */
  const maxViewableUsersPerPage = 10

  /** Number of pages that will be needed to view all users */
  const pages = Math.ceil(filteredUsers.length / maxViewableUsersPerPage)

  /** Function to view the previous page of users if available. */
  const viewPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  /** Function to view the next page of users if available. */
  const viewNext = () => {
    if (currentPage <= pages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  /** First user index that are viewable on the current page */
  const firstUserIndex = maxViewableUsersPerPage * (currentPage - 1) + 1  > filteredUsers.length ? filteredUsers.length : maxViewableUsersPerPage * (currentPage - 1) + 1
  
  /** Last user index that are viewable on the current page */
  const lastUserIndex = maxViewableUsersPerPage * currentPage > filteredUsers.length ? filteredUsers.length : maxViewableUsersPerPage * currentPage
  
  /** All users that are viewable on the current page */
  const viewableUsers = filteredUsers.slice((firstUserIndex - 1) >= 0 ? firstUserIndex - 1 : 0, lastUserIndex)

  /** Pagination and searching logic ends */

  const [parentChecked, setParentChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  
  const parentCheckboxRef = useRef<HTMLInputElement>(null);
  if (parentCheckboxRef.current) {
    parentCheckboxRef.current.indeterminate = indeterminate;
  }

  const [childChecked, dispatchChildChecked] = useReducer(
    (state: {[key: number]: boolean}, action: {type: string, payload: {index?: number, checked?: boolean}}) => {
      switch (action.type) {
        case 'SET_ALL':
          allUsers.map(user => {
            state[user.slno] = action.payload.checked!;
          });
          return state
        case 'TOGGLE':
          return {
            ...state,
            [action.payload.index!]: !state[action.payload.index!]
          };
        case 'SET':
          return {
            ...state,
            [action.payload.index!]: action.payload.checked!
          };
        case 'RESET':
          allUsers.map(user => state[user.slno] = false);
          return state;
        default:
          return state;
      }
  }, {});

  useEffect(() => {
    dispatchChildChecked({type: 'RESET', payload: {}});
    setParentChecked(false);
    setIndeterminate(false);
  }, [allUsers]);

  useEffect(() => {
    const allChecked = Object.values(childChecked).every(checked => checked);
    const noneChecked = Object.values(childChecked).every(checked => !checked);
    setParentChecked(allChecked);
    setIndeterminate(!allChecked && !noneChecked);
  }, [childChecked]);

  const handleParentCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setParentChecked(checked);
    setIndeterminate(false);
    dispatchChildChecked({type: 'SET_ALL', payload: {checked}});
  }

  const handleChildCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    dispatchChildChecked({type: 'SET', payload: {index, checked: e.target.checked}});
  }

  const toggleChildUserCheckbox = (index: number) => {
    dispatchChildChecked({type: 'TOGGLE', payload: {index}});
  }

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
          <DialogTrigger className="w-max text-background transition-all bg-text dark:hover:bg-blue-400 dark:focus-within:bg-blue-400 mt-2 self-end" asChild>
            <Button
              id="add-user"
              text="Add User"
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
          <div className="flex justify-between p-4 pb-2 items-center text-sm gap-2 flex-wrap">
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
            <div className="flex items-center gap-1 md:gap-4">
              <div className="user-manage-btn">
                Users {firstUserIndex}-{lastUserIndex} of {filteredUsers.length}
              </div>
              <button onClick={viewPrevious} disabled={currentPage === 1} className="user-manage-btn group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1.2em]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                <div className="user-manage-btn-desc">Previous</div>
              </button>
              <button onClick={viewNext} disabled={currentPage === pages} className="user-manage-btn group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1.2em]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
                <div className="user-manage-btn-desc">Next</div>
              </button>
            </div>
          </div>
          <div className="flex px-4 pb-2 items-center text-sm gap-4 flex-wrap">
            <button
              onClick={
                () => {
                  toast.promise(refreshUsers, {
                    loading: 'Refreshing users. Please wait...',
                    success: () => {
                      dispatchChildChecked({type: 'RESET', payload: {}});
                      return 'Users refreshed successfully!'
                    },
                    error: 'Failed to refresh users. Please try again.'
                  })
                }
              }
              className="user-manage-btn group"
              aria-details="Refresh users"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-[1.2em]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              <div className="user-manage-btn-desc">Refresh users</div>
            </button>
            <button
              onClick={
                () => {
                  if (confirm("Are you sure you want to activate all selected users?"))
                  toast.promise(activateStatuses, {
                    loading: 'Activating users. Please wait...',
                    success: () => {
                      dispatchChildChecked({type: 'RESET', payload: {}});
                      return 'Users activated successfully!'
                    },
                    error: 'Failed to activate users. Please try again.'
                  })
                }
              }
              disabled={!Object.values(childChecked).some(checked => checked)}
              className="user-manage-btn group disabled:hidden"
            >
              <div className="user-manage-btn-desc">Activate</div>
              <BiUserCheck className="text-lg stroke-0.5" />
            </button>
            <button
              onClick={
                () => {
                  if (confirm("Are you sure you want to deactivate all selected users?"))
                  toast.promise(deactivateStatuses, {
                    loading: 'Deactivating users. Please wait...',
                    success: () => {
                      dispatchChildChecked({type: 'RESET', payload: {}});
                      return 'Users deactivated successfully!'
                    },
                    error: 'Failed to deactivate users. Please try again.'
                  })
                }
              }
              disabled={!Object.values(childChecked).some(checked => checked)}
              className="user-manage-btn group disabled:hidden"
            >
              <BiUserX className="text-lg stroke-0.5" />
              <div className="user-manage-btn-desc">Deactivate</div>
            </button>
            <div
              className={`user-manage-btn bg-blue-500/30 ${Object.values(childChecked).filter(checked => checked).length === 0 ? 'hidden' : 'block'}`}
            >
              {Object.values(childChecked).filter(checked => checked).length} selected
            </div>
          </div>
          <div className="overflow-x-auto scrollbar">
            <table className="w-full text-left table-auto rounded-t-2xl">
              <thead>
                <tr className="first:rounded-tl-2xl">
                  <th scope="col" className="p-4 border-t-2 border-b border-slate-400/30 dark:border-slate-600 bg-slate-50 transition-colors dark:bg-slate-900">
                    <p className="block text-sm leading-none text-text font-bold">
                      <input ref={parentCheckboxRef} type="checkbox" name="" className="cursor-pointer" id="parent-users-checkbox" checked={parentChecked} onChange={handleParentCheckboxChange} />
                    </p>
                  </th>
                  <th scope="col" className="p-4 border-t-2 border-b border-slate-400/30 dark:border-slate-600 bg-slate-50 transition-colors dark:bg-slate-900">
                    <p className="block text-sm leading-none text-text font-bold">
                      User ID
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
                      Current Status
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  viewableUsers.length > 0 ?
                  viewableUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-blue-500/30 dark:hover:bg-blue-500/30 cursor-pointer" onClick={() => toggleChildUserCheckbox(user.slno)}>
                      <td className={`p-4 ${index !== viewableUsers.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                        <input type="checkbox" name="" id={"child-users-checkbox-"+user.slno} className="cursor-pointer" checked={childChecked[user.slno] || false} onChange={e => handleChildCheckboxChange(e, user.slno)} />
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
                      <td className={`p-4 ${index !== viewableUsers.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                        <p className={`block font-bold text-sm ${user.status === 1 ? 'text-green-500' : 'text-red-500'}`}>
                          {user.status === 1 ? 'Activated' : 'Deactivated'}
                        </p>
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