import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';




describe('HomeComponent', () => {

  //help us can detect any changging
  let fixture: ComponentFixture<HomeComponent>;

  //define the component that we use to make a test
  let component:HomeComponent;

  //this variable to allow us to make the css query to test the element in DOM
  let el: DebugElement;

  let coursesService: any;


  const beginnerCourse = setupCourses().filter(course => course.category === 'BEGINNER');

  const advanceCourse = setupCourses().filter(course => course.category === 'ADVANCE');


  const bothCourse = setupCourses();

  beforeEach(( async () => {

    const courseServiceSpy = jasmine.createSpyObj('CoursesService', ["findAllCourses"]);

    await TestBed.configureTestingModule({
      imports:[
        CoursesModule,
        NoopAnimationsModule 

      ],
      providers: [
        {
          provide: CoursesService, 
          useValue: courseServiceSpy
        }
      ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      component = fixture.componentInstance;
      el = fixture.debugElement;
      coursesService = TestBed.inject(CoursesService);
    })

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  xit("should display only beginner courses", () => {

    coursesService.findAllCourses.and.returnValue(of(beginnerCourse));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpect number of tab found");
  });


  xit("should display only advanced courses", () => {

    coursesService.findAllCourses.and.returnValue(of(advanceCourse));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpect number of tab found");
  });


  xit("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(bothCourse));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(2, "Unexpect number of tab found");

  });


  xit("should display advanced courses when tab clicked", () => {

    coursesService.findAllCourses.and.returnValue(of(bothCourse));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]);

    fixture.detectChanges();

    const cartTitle = el.queryAll(By.css('.mat-card-title'));

    expect(cartTitle.length).toBeGreaterThan(0, "Could not find card titles");

    expect(cartTitle[0].nativeElement.contentText).toContain('Angular Security Course');

  });

});


