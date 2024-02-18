import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteStudent, getStudent, getStudents } from 'apis/students.api'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Students as StudentsType } from 'types/students.type'
import { useQueryString } from 'utils/utils'
import classNames from 'classnames'
import { toast } from 'react-toastify'
const LIMIT = 10
export default function Students() {
  // const [students, setStudents] = useState<StudentsType>([])
  // const [isLoading, setIsLoading] = useState<boolean>(false)
  // useEffect(() => {
  //   setIsLoading(true)
  //   getStudents(1, 10)
  //     .then((res) => {
  //       setStudents(res.data)
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [])

  const queryClient = useQueryClient();
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1

  const studentsQuery = useQuery({
    queryKey: ['students', page],
    queryFn: () => getStudents(page, LIMIT),
    staleTime: 3000,
    placeholderData: keepPreviousData
  })

  const deleteStudentMutation = useMutation({
    mutationFn: (id: number | string) => deleteStudent(id),
  })

  const handleDeleteStudent = (id: number) => {
    deleteStudentMutation.mutate(id, {
      onSuccess: (_, variable) => {
        toast.success(`Xóa thành công student với id ${variable}`);
        queryClient.invalidateQueries({queryKey: ['students', page], exact: true})
      }
    })
  }
  const totalStudentsCount = Number(studentsQuery.data?.headers['x-total-count'] || 0)
  const totalPage = Math.ceil(totalStudentsCount / LIMIT)

  const handlePreFetchStudent = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ['student', String(id)],
      queryFn: () => getStudent(id),
      staleTime: 3000,
    })
  }

  const refetchStudents = () => {
    studentsQuery.refetch()
  }

  const cancelRequestStudents = () => {
    queryClient.cancelQueries({ queryKey: ['students', page] })
  }

  return (
    <div>
      <h1 className='text-lg'>Students</h1>
      <div>
        <button className='mt-6 rounded bg-pink-700 px-5 py-2 text-white' onClick={refetchStudents}>
          Refetch Students
        </button>
      </div>
      <div>
        <button className='mt-6 rounded bg-pink-700 px-5 py-2 text-white' onClick={cancelRequestStudents}>
          Cancel Request Students
        </button>
      </div>
      <div className='mt-6'>
        <Link
          to='/students/add'
          className=' rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 '
        >
          Add Student
        </Link>
      </div>
      {studentsQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!studentsQuery.isLoading && (
        <>
          <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
            <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
                <tr>
                  <th scope='col' className='px-6 py-3'>
                    #
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Avatar
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Name
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    Email
                  </th>
                  <th scope='col' className='px-6 py-3'>
                    <span className='sr-only'>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {studentsQuery.data?.data.map((s) => (
                  <tr
                    key={s.id}
                    className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'
                    onMouseEnter={() => handlePreFetchStudent(s.id)}
                  >
                    <td className='px-6 py-4'>{s.id}</td>
                    <td className='px-6 py-4'>
                      <img src={s.avatar} alt='student' className='h-5 w-5' />
                    </td>
                    <th scope='row' className='whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white'>
                      {s.last_name}
                    </th>
                    <td className='px-6 py-4'>{s.email}</td>
                    <td className='px-6 py-4 text-right'>
                      <Link
                        to={`/students/${s.id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button className='font-medium text-red-600 dark:text-red-500' onClick={() => handleDeleteStudent(s.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex justify-center'>
            <nav aria-label='Page navigation example'>
              <ul className='inline-flex -space-x-px'>
                <li>
                  {page === 1 ? (
                    <span className='cursor-not-allowed rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                      Previous
                    </span>
                  ) : (
                    <Link
                      className='rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                      to={`/students?page=${page - 1}`}
                    >
                      Previous
                    </Link>
                  )}
                </li>
                {Array(totalPage)
                  .fill(0)
                  .map((_, index) => {
                    const pageNumber = index + 1
                    const isActive = page === pageNumber
                    return (
                      <li key={pageNumber}>
                        <Link
                          className={classNames(
                            'border border-gray-300   px-3 py-2 leading-tight  hover:bg-gray-100 hover:text-gray-700 ',
                            {
                              'bg-gray-100 text-gray-700': isActive,
                              'bg-white text-gray-500': !isActive
                            }
                          )}
                          to={`/students?page=${pageNumber}`}
                        >
                          {pageNumber}
                        </Link>
                      </li>
                    )
                  })}

                <li>
                  {page === totalPage ? (
                    <span className='cursor-not-allowed rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '>
                      Next
                    </span>
                  ) : (
                    <Link
                      className='rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight text-gray-500 hover:bg-gray-100 hover:text-gray-700 '
                      to={`/students?page=${page + 1}`}
                    >
                      Next
                    </Link>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  )
}
