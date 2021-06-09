import { Injectable } from '@angular/core';
import { Student } from './students/student';
import { STUDENTS } from './students/mock-students';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private studentsURL = 'http://localhost:8080/students';  // URL to web api


  getStudents(): Observable<Student[]> {
    this.log('StudentService: fetched students');
    return this.http.get<Student[]>(this.studentsURL)
      .pipe(
        tap(_ => this.log('fetched students')),
        catchError(this.handleError<Student[]>('getStudents', []))
      );
  }

  getStudent(id: number): Observable<Student> {
    // For now, assume that a Student with the specified `id` always exists.
    const url = `${this.studentsURL}/${id}`;
    return this.http.get<Student>(url).pipe(
      tap(_ => this.log(`fetched Student id=${id}`)),
      catchError(this.handleError<Student>(`getStudent id=${id}`))
    );
  }

  updateStudent(student: Student): Observable<any> {
    return this.http.put(this.studentsURL, student, this.httpOptions).pipe(
      tap(_ => this.log(`updated Student id = ${student.id}`)),
      catchError(this.handleError<any>('updateStudent'))
    );
  }

  /** POST: add a new student to the server */
  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.studentsURL, student, this.httpOptions).pipe(
      tap((newStudent: Student) => this.log(`added Student w/ id=${newStudent.id}`)),
      catchError(this.handleError<Student>('addStudent'))
    );
  }

  /** DELETE: delete the student from the server */
  deleteStudent(id: number): Observable<Student> {
    const url = `${this.studentsURL}/${id}`;

    return this.http.delete<Student>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted student id=${id}`)),
      catchError(this.handleError<Student>('deleteStudent'))
    );
  }

  searchStudents(term: string): Observable<Student[]> {
    if (!term.trim()) {
      // if not search term, return empty student array.
      return of([]);
    }
    return this.http.get<Student[]>(`${this.studentsURL}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found students matching "${term}"`) :
        this.log(`no students matching "${term}"`)),
      catchError(this.handleError<Student[]>('searchStudents', []))
    );
  }


  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  /** Log a StudentService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`StudentService: ${message}`);
  }

  constructor(
    private messageService: MessageService,
    private http: HttpClient) { }
}
