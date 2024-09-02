import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';
import { title } from 'process';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;

  let fixture: ComponentFixture<CoursesCardListComponent>;

  let el: DebugElement;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [CoursesModule],
      providers: []
    })
    .compileComponents()
    .then(() => {
       fixture = TestBed.createComponent(CoursesCardListComponent);
       component = fixture.componentInstance;
       el = fixture.debugElement;
    })

  })

  it("should create the component", () => {

   expect(component).toBeTruthy();

   console.log(component)

  });


  it("should display the course list", () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const cart = el.queryAll(By.css('.course-card'));

    expect(cart).toBeTruthy('No course was found');
    expect(cart.length).toBe(12, "Unexpected number");
  });


  it("should display the first course", () => {

    component.courses = setupCourses(); // Initialize courses
    fixture.detectChanges(); // Trigger change detection

    const course = component.courses[0]; // Get the first course

    // Corrected the selector to match the course card element
    const card = el.query(By.css(".course-card:first-child"));
    
    // Assuming the correct class is `mat-card-title`
    const title = card.query(By.css("mat-card-title"));

    // Assertions
    expect(card).toBeTruthy('No card found');
    expect(title.nativeElement.textContent).toBe(course.titles.description);
});


});


