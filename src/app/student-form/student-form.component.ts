import { Component } from '@angular/core';
import { Student } from '../students/student_class'

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent {

  model = new Student(18, 'Dr IQ', 'Chuck@Overstreet.com');

  submitted = false;

  onSubmit() { this.submitted = true; }

  newStudent() {
    this.model = new Student(42, '', '');
  }

}//estoy volviendo a instalar xq tuve problemas con las libs hace un rato,no vaya a ser ese el problema