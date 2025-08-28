import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Button, Select, MenuItem, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

export default function Schedule() {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("week");
  const [classList, setClassList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectPeriodStart, setSubjectPeriodStart] = useState(null);
  const [subjectPeriodEnd, setSubjectPeriodEnd] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [searchClass, setSearchClass] = useState("");

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${baseApi}/schedule/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const formattedEvents = res.data.data.map((item) => ({
        id: item._id,
        title: `Subject: ${item.subject?.subject_name || "N/A"}, Teacher: ${item.teacher?.name || "N/A"}, Class: ${item.class?.class_text || "N/A"}`,
        start: new Date(item.start_time),
        end: new Date(item.end_time),
        teacher: item.teacher,
        subject: item.subject,
        class: item.class,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const handleSearchByClass = () => {
    if (!searchClass) {
      fetchEvents();
      return;
    }

    const filtered = events.filter((ev) => {
      const classId = typeof ev.class === "string" ? ev.class : ev.class?._id;
      return String(classId) === String(searchClass);
    });

    setEvents(filtered);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, teacherRes, subjectRes] = await Promise.all([axios.get(`${baseApi}/class/all`), axios.get(`${baseApi}/manageteacher/all`), axios.get(`${baseApi}/subject/all`)]);

        setClassList(classRes.data.data);
        setTeacherList(teacherRes.data.teachers);
        setSubjectList(subjectRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    fetchEvents();
  }, []);

  const handleOpen = () => setOpenModal(true);

  const handleClose = () => {
    setOpenModal(false);
    setSelectedClass("");
    setSelectedTeacher("");
    setSelectedSubject("");
    setSubjectPeriodStart(null);
    setSubjectPeriodEnd(null);
    setSelectedDate("");
    setEditEvent(null);
  };

  const handleAssignPeriod = async () => {
    // Validate all fields first
    if (
      !selectedTeacher ||
      typeof selectedTeacher !== "object" ||
      !selectedTeacher._id ||
      !selectedSubject ||
      typeof selectedSubject !== "object" ||
      !selectedSubject._id ||
      !selectedClass ||
      typeof selectedClass !== "object" ||
      !selectedClass._id ||
      !subjectPeriodStart ||
      !subjectPeriodEnd ||
      !selectedDate
    ) {
      toast.error("Please fill all fields properly.");
      return;
    }

    const startDateTime = moment(selectedDate)
      .set({
        hour: subjectPeriodStart.hours(),
        minute: subjectPeriodStart.minutes(),
      })
      .toDate();

    const endDateTime = moment(selectedDate)
      .set({
        hour: subjectPeriodEnd.hours(),
        minute: subjectPeriodEnd.minutes(),
      })
      .toDate();

    const scheduleData = {
      teacher: selectedTeacher._id,
      subject: selectedSubject._id,
      classId: selectedClass._id,
      start_time: startDateTime,
      end_time: endDateTime,
    };

    try {
      if (editEvent) {
        const response = await axios.patch(`${baseApi}/schedule/update/${editEvent.id}`, scheduleData);
        if (response.data.success) {
          toast.success("Schedule updated!");

          const updatedEvents = events.map((ev) =>
            ev.id === editEvent.id
              ? {
                  ...ev,
                  title: `Subject: ${selectedSubject.subject_name}, Teacher: ${selectedTeacher.name}, Class: ${selectedClass.class_text}`,
                  start: startDateTime,
                  end: endDateTime,
                  teacher: selectedTeacher,
                  subject: selectedSubject,
                  class: selectedClass,
                }
              : ev
          );
          setEvents(updatedEvents);
        }
      } else {
        const response = await axios.post(`${baseApi}/schedule/create`, scheduleData);
        if (response.data.success) {
          toast.success("Schedule created successfully!");
          const created = response.data?.data;

          const newEvent = {
            id: created?._id || Math.random(),
            title: `Subject: ${selectedSubject.subject_name}, Teacher: ${selectedTeacher.name}, Class: ${selectedClass.class_text}`,
            start: new Date(startDateTime),
            end: new Date(endDateTime),
            teacher: selectedTeacher,
            subject: selectedSubject,
            class: selectedClass,
          };

          setEvents([...events, newEvent]);
        }
      }
      handleClose();
    } catch (error) {
      console.error("Error saving schedule:", error?.response?.data || error.message);
      toast.error("Failed to save schedule. Check inputs.");
    }
  };

  const handleEditEvent = (event) => {
    setEditEvent(event);
    setSelectedTeacher(event.teacher);
    setSelectedSubject(event.subject);
    setSelectedClass(event.class);
    setSubjectPeriodStart(moment(event.start));
    setSubjectPeriodEnd(moment(event.end));
    setSelectedDate(moment(event.start).format("YYYY-MM-DD"));
    handleOpen();
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this period?");
    if (!confirmDelete) return; //
    try {
      await axios.delete(`${baseApi}/schedule/delete/${eventId}`);
      setEvents(events.filter((event) => event.id !== eventId));
      window.confirm("Are You sure you want to delete this period.");
      handleClose();
      toast.success("Event deleted successfully.");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event.");
    }
  };

  return (
    <div>
      <h1>Schedule</h1>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2, mt: 2 }}>
        <Button onClick={handleOpen}>Add New Period</Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Class</InputLabel>
          <Select value={searchClass} onChange={(e) => setSearchClass(e.target.value)} label="Filter by Class">
            <MenuItem value="">All Classes</MenuItem>
            {classList.map((cls) => (
              <MenuItem key={cls._id} value={cls._id}>
                {cls.class_text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSearchByClass}>
          Search
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setSearchClass("");
            fetchEvents(); // show all again
          }}
        >
          Reset
        </Button>
      </Box>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "500px", margin: "20px" }}
        date={date}
        onNavigate={(newDate) => setDate(newDate)}
        view={view}
        onView={(newView) => setView(newView)}
        views={{ month: true, week: true, day: true, agenda: true }}
        onSelectEvent={handleEditEvent}
        onDoubleClickEvent={handleEditEvent}
      />

      <Dialog open={openModal} onClose={handleClose}>
        <DialogTitle>{editEvent ? "Edit Period" : "Add New Period"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Class</InputLabel>
            <Select
              value={selectedClass?._id || ""}
              onChange={(e) => {
                const selected = classList.find((c) => c._id === e.target.value);
                setSelectedClass(selected);
              }}
              label="Select Class"
            >
              {classList.map((classItem) => (
                <MenuItem key={classItem._id} value={classItem._id}>
                  {classItem.class_text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Teacher</InputLabel>
            <Select
              value={selectedTeacher?._id || ""}
              onChange={(e) => {
                const selected = teacherList.find((t) => t._id === e.target.value);
                setSelectedTeacher(selected || {});
              }}
              label="Select Teacher"
              displayEmpty
            >
              {teacherList.map((teacher) => (
                <MenuItem key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Subject</InputLabel>
            <Select
              value={selectedSubject?._id || ""}
              onChange={(e) => {
                const selected = subjectList.find((s) => s._id === e.target.value);
                setSelectedSubject(selected);
              }}
              label="Select Subject"
            >
              {subjectList.map((subject) => (
                <MenuItem key={subject._id} value={subject._id}>
                  {subject.subject_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker label="Start Time" value={subjectPeriodStart} onChange={setSubjectPeriodStart} renderInput={(params) => <TextField {...params} fullWidth />} />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker label="End Time" value={subjectPeriodEnd} onChange={setSubjectPeriodEnd} renderInput={(params) => <TextField {...params} fullWidth />} />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <TextField fullWidth label="Date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} InputLabelProps={{ shrink: true }} margin="normal" />
        </DialogContent>
        <DialogActions>
          {editEvent && (
            <Button onClick={() => handleDeleteEvent(editEvent.id)} color="error">
              Delete
            </Button>
          )}
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAssignPeriod} color="primary">
            {editEvent ? "Update Period" : "Assign Period"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
