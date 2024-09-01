import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { COURSES } from "../../../../server/db-data";

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
    });

    it('should find a course by it', () =>{
        coursesService.findCourseById(12)
            .subscribe(course => {
                expect(course).toBeTruthy()
                expect(course?.id).toBe(12);
            });

        const req = httpTestingController.expectOne('/api/courses/12', 'Path URL called is failed');
        expect(req.request.method).toEqual('GET');

        req.flush(Object.values(COURSES[12]));
    })

    afterEach(() => {
        // Ensure that there are no outstanding requests after each test.
        httpTestingController.verify();
    });
});
