import { useEffect, useState } from "react"
import Navbar from "../../components/Layout"
import { CardContent } from "../../components/ui/Card"
import { Card } from "../../components/ui/Card"
import { getAttendances } from "../../services/attendance.service"
import { showToast } from "../../lib/toast"
import { Eye } from "lucide-react"
import Pagination from "../../components/Pagination"
import { Search } from "../../components/ui/Search"
import { Modal } from "antd" 
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { TableData, TableHeaderCell } from "../../components/ui/Table"

interface Employee {
    employee_id: string,
    name: string,
    department: string,
}

interface Attendance {
    id: number,
    clock_in: string,
    clock_out: string,
    date: string,
    is_late: boolean
    employee: Employee,
    image_url: string,
}

const Attendance = () => {

    const [attendance, setAttendance] = useState<Attendance[]>([])
    const [search, setSearch] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [date, setDate] = useState<Date | null>(new Date())
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined)

    const formatDate = (date: Date | null) => {
        if (!date) {
            date = new Date()
        }
        return date.toLocaleDateString("sv-SE")
    }

    const callGetAttendances = async (selectedDate: Date | null, search?: string, page?: number) => {
        try {

            const formattedDate = formatDate(selectedDate)

            const data = await getAttendances(formattedDate, search, page)
            setAttendance(data.data.data)
            setPage(data.data.page)
            setLastPage(data.data.lastPage)
        } catch(error) {
            showToast.error('Something Wrong')
        }
    }

    const formatToWIB = (dateString: string | undefined | null, format: any) => {
        if (!dateString) {
            return '-'
        }
        return new Date(dateString).toLocaleString("id-ID", format)
    }

    const openModal = (url: string) => {
        setModalOpen(true)
        setSelectedImage(url)
    }

    useEffect(() => {
        callGetAttendances(date, debouncedSearch, page)
    }, [date, debouncedSearch, page])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 500)

        return () => clearTimeout(handler)
    }, [search])
    
    return (
        <Navbar>
            <div className="p-6 space-y-6 bg-gray-50">
                <div>
					<h1 className="text-2xl font-bold">Attendances</h1>
					<p className="text-gray-500">History of absence employee</p>
				</div>
            
                <Card>
                    <CardContent>
                        <div className="overflow-x-auto flex flex-col space-y-4 rounded-lg">
                            <Search 
                                placeholder="Search by name"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="max-w-sm"
                            />

                            <DatePicker 
                                selected={date}
                                onChange={(d: Date | null) => {
                                    setDate(d)
                                    setPage(1)
                                }}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select Date"
                                className="bw-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 shadow-sm transition-all duration-200 text-gray-500"
                                popperPlacement="bottom-start"
                                portalId="root"
                                popperClassName="z-50"
                            />
                            
                            <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <TableHeaderCell>
                                            Employee ID
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Name
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Department
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Date
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Clock-in
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Clock-out
                                        </TableHeaderCell>
                                        <TableHeaderCell>
                                            Evidence
                                        </TableHeaderCell>
                                    </tr>
                                    </thead>

                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {attendance.length > 0 ? (
                                        attendance.map((att, index) => (
                                        <tr
                                            key={att.id}
                                            className={`hover:bg-gray-100 transition-colors ${
                                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            }`}
                                        >
                                            <TableData>
                                                {att.employee.employee_id}
                                            </TableData>
                                            <TableData>
                                                {att.employee.name}
                                            </TableData>
                                            <TableData>
                                                {att.employee.department}
                                            </TableData>
                                            <TableData>
                                                {formatToWIB(att.date, {
                                                    timeZone: "Asia/Jakarta",
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })}
                                            </TableData>
                                            <TableData>
                                                {formatToWIB(att.clock_in, {
                                                    timeZone: "Asia/Jakarta",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </TableData>
                                            <TableData>
                                                {formatToWIB(att.clock_out, {
                                                    timeZone: "Asia/Jakarta",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </TableData>
                                            <TableData>
                                                <Eye
                                                    className="h-6 w-6 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                                                    onClick={() => openModal(att.image_url)}
                                                />
                                            </TableData>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        <td colSpan={7} className="text-center py-6 text-gray-500 italic">
                                            No attendances found
                                        </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                                </div>
                        </div>
                    </CardContent>

                    <Modal 
                        title="Evidence"
                        open={modalOpen}
                        onCancel={() => setModalOpen(false)}
                        footer={null}
                    >
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="evidence"
                                className="w-full rounded-lg"
                            />
                        )}
                    </Modal>

                    <Pagination
                        currentPage={page}
                        totalPages={lastPage}
                        onPageChange={(p) => setPage(p)}
                    />
                </Card>
            </div>
        </Navbar>
    )
}

export default Attendance