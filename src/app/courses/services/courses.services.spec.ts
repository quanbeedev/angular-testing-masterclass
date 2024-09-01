import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { HttpResponse, provideHttpClient } from "@angular/common/http";
import { COURSES, findLessonsForCourse, LESSONS } from "../../../../server/db-data";
import { Course } from "../model/course";
import { throwError } from "rxjs";

describe("CoursesService", () => {

    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;

    // Unit test - isolate component or service, faking the relationship to others.
    // Integration test - test with all flow that interacts with another part.

    beforeEach(() => {
        // beforeEach allows us to define code that can be reused in many test cases.

        TestBed.configureTestingModule({
            providers: [    
                // Here we provide the dependency that will be faked and injected into the service.
                // We import the component, service, pipe, or directive.
                CoursesService,
                provideHttpClient(), // Provide HttpClient along with HttpClientTesting
                provideHttpClientTesting()
            ]
        });

        coursesService = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should retrieve all courses', () => {
        coursesService.findAllCourses()
            .subscribe(courses => {
                expect(courses).toBeTruthy('No courses returned');
                expect(courses.length).toBe(12, "Incorrect number of courses");

                const course = courses.find(course => course.id === 12);
                expect(course?.titles?.description).toBe("Angular Testing Course");
            });

        const req = httpTestingController.expectOne('/api/courses', 'Path URL called is failed');
        expect(req.request.method).toEqual('GET');

        req.flush({ payload: Object.values(COURSES) });

        httpTestingController.verify();
    });

    it('should find a course by it', () =>{
        coursesService.findCourseById(12)
            .subscribe(course => {
                expect(course).toBeTruthy()
                expect(course?.id).toBe(12);
            });

        const req = httpTestingController.expectOne('/api/courses/12', 'Path URL called is failed');
        expect(req.request.method).toEqual('GET');

        req.flush(COURSES[12]);

        httpTestingController.verify();
    })

    it('should save a course', () => {

        const changes: Partial<Course> = {
            titles:{
                description: "Testing Couses"
            }
        }

        coursesService.saveCourse(12, changes).subscribe(course => {
            expect(course.id).toBe(12);
        })

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body.titles.description)
        .toEqual(changes.titles.description);

        req.flush({
            ...COURSES[12],
            ...changes
        })
    })

    it('should have an error if save course failed', () => {
        const changes: Partial<Course> = {
            titles: {
                description: "Test Course"
            }
        };
    
        // Simulate a failing saveCourse method
        // spyOn(coursesService, 'saveCourse').and.returnValue(throwError({ status: 500 }));
    
        coursesService.saveCourse(12, changes)
            .subscribe(
                () => fail("the save course operation should have failed"),
                (error: HttpResponse<number>) => {
                    expect(error.status).toBe(500);
                }
            );

        const req = httpTestingController.expectOne('/api/courses/12');

        expect(req.request.method).toEqual('PUT');
        req.flush('Save course failed',
             {
                status: 500, 
                statusText: 'Internal Server Error'
            });
    });

    it('should find a list of lessons', () => {
        coursesService.findLessons(12)
        .subscribe(lessons =>{
            expect(lessons).toBeTruthy();

            expect(lessons.length).toBe(3);
        })

        // /api/lesson?courseId=12&pageNumber=0
        const req = httpTestingController.expectOne(req => req.url == '/api/lessons');

        expect(req.request.method).toEqual("GET");

        expect(req.request.params.get("courseId")).toEqual("12");
        expect(req.request.params.get("filter")).toEqual("");
        expect(req.request.params.get("sortOrder")).toEqual("asc");
        expect(req.request.params.get("pageNumber")).toEqual("0");
        expect(req.request.params.get("pageSize")).toEqual("3");


        req.flush({
            payload: findLessonsForCourse(12).slice(0,3)
        })

    });





    afterEach(() => {
        // Ensure that there are no outstanding requests after each test.
        httpTestingController.verify();
    });
});
