import { create } from "zustand";
import { isActiveMessage } from "../utils/hour";
import { fetchCourses } from "../services/fetchCourses";

export interface DataCourse {
    subject: string;
    name: string;
    classroom: string;
    startHour: string;
    endHour: string
}

export interface StoreCourse {
    courseMessages: DataCourse[]
    avalaibleCourseMessages: DataCourse[]
    error: string
    addCourseMessages: (message: DataCourse[]) => void
    addAvalaibleCourseMessage: () => void
    setError: (error:string) => void
    fetchAdvertisingsBySectorId: (sectorId:number) => void
    emptyCourseMessages: () => void
}
  
  
export const useCourseMessages = create<StoreCourse>()((set, get) => ({
    courseMessages: [],
    avalaibleCourseMessages: [],  
    error: '',

    emptyCourseMessages: () => {
      set({
        courseMessages: []
      })
      set({
        avalaibleCourseMessages: []
      })
    },

    addCourseMessages: (messages: DataCourse[]) => {
      set((state) => ({
        courseMessages: [...state.courseMessages, ...messages],
      }));
    },

    addAvalaibleCourseMessage: () => {
      setInterval(() => {
        const newAvailableMessages = get().courseMessages.filter(message => isActiveMessage({ 
          startHour: message.startHour,
          endHour: message.endHour
        }))

        if(newAvailableMessages.length !== get().avalaibleCourseMessages.length) {
              set(({
                avalaibleCourseMessages: newAvailableMessages
              }))
        }
      }, 1000)
    },

    setError: (error:string) => {
      set(({
        error
      }))
    },

    fetchAdvertisingsBySectorId: (sectorId) => {
      if(get().courseMessages.length === 0) {
        fetchCourses(sectorId)
          .then(courses =>
            courses.map((course:any) => {
              const { classroom, name, schedule, subject } = course

              return {
                classroom: classroom.name,
                name,
                startHour: schedule.startHour,
                endHour: schedule.endHour,
                subject: subject.name
              }
            })
          )
          .then((courses) => get().addCourseMessages(courses))
      }
    }
}))