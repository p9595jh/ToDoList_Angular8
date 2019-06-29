import { Component, OnInit } from '@angular/core';
import { NgFlashMessageService } from 'ng-flash-messages';

import { ToDoService } from 'src/app/services/to-do.service';
import { Work } from 'src/app/models/work';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  nbsp = new Array(20);
  work: Work;
  works: Work[];

  constructor(
    private flashMessage: NgFlashMessageService,
    private toDoService: ToDoService
  ) {
    this.toDoService.getWorks().subscribe(works => {
      this.works = works;
      this.sortWorks();
    });
  }

  ngOnInit() {
    this.work = {
      date: this.getDate(),
      work: ''
    };
  }

  private format2Letter(text: number): string {
    let s: string = text >= 10 ? '' : '0';
    return s + text;
  }

  private getDate(): string {
    const date = new Date();
    return `${date.getFullYear()}-${this.format2Letter(date.getMonth()+1)}-${this.format2Letter(date.getDate())}T${this.format2Letter(date.getHours())}:${this.format2Letter(date.getMinutes())}:${this.format2Letter(date.getSeconds())}`;
  }

  private sortWorks() {
    this.works.sort((a: Work, b: Work) => {
      return a.date.localeCompare(b.date);
    });
  }

  onAddSubmit() {
    if ( this.work.date == '' || this.work.date == undefined || this.work.work == '' || this.work.work == undefined ) {
      this.flashMessage.showFlashMessage({
        messages: ['Empty field exists.'],
        type: 'danger',
        timeout: 3000
      });
      return false;
    }

    if ( new Date(this.work.date) < new Date() ) {
      this.flashMessage.showFlashMessage({
        messages: ['Already passed date.'],
        type: 'danger',
        timeout: 3000
      });
      return false;
    }

    this.toDoService.addWork(this.work).subscribe(result => {
      if ( result.success ) {
        this.toDoService.getWorks().subscribe(works => {
          this.works = works;
          this.sortWorks();
          this.flashMessage.showFlashMessage({
            messages: ['A new schedule added.'],
            type: 'success',
            timeout: 2000
          });
        });
      } else {
        this.flashMessage.showFlashMessage({
          messages: ['Error while adding a schedule.'],
          type: 'danger',
          timeout: 3000
        });
      }
    });
  }

  editWork(_id: string) {
    let _date: HTMLInputElement = <HTMLInputElement> document.getElementById('date' + _id);
    let _work: HTMLInputElement = <HTMLInputElement> document.getElementById('work' + _id);

    if ( _date.readOnly ) {
      _date.readOnly = false;
      _work.readOnly = false;

    } else {
      if ( _date.value == '' || _date.value == undefined || _work.value == '' || _work.value == undefined ) {
        this.toDoService.getWork(_id).subscribe(work => {
          _date.value = work.date;
          _work.value = work.work;
          _date.readOnly = true;
          _work.readOnly = true;
          this.flashMessage.showFlashMessage({
            messages: ['Empty field exists.'],
            type: 'danger',
            timeout: 3000
          });
          return false;
        });

      } else if ( new Date(_date.value) < new Date() ) {
        this.toDoService.getWork(_id).subscribe(work => {
          _date.value = work.date;
          _work.value = work.work;
          _date.readOnly = true;
          _work.readOnly = true;
          this.flashMessage.showFlashMessage({
            messages: ['Already passed date.'],
            type: 'danger',
            timeout: 3000
          });
          return false;
        });

      } else {
        const w: Work = {
          date: _date.value,
          work: _work.value
        };
        this.toDoService.updateWork(_id, w).subscribe(result => {
          if ( result._id ) {
            _date.readOnly = true;
            _work.readOnly = true;
  
          } else {
            this.toDoService.getWork(_id).subscribe(work => {
              _date.value = work.date;
              _work.value = work.work;
              _date.readOnly = true;
              _work.readOnly = true;
              this.flashMessage.showFlashMessage({
                messages: ['Error while editing.'],
                type: 'danger',
                timeout: 3000
              });
              return false;
            });
          }
        });
      }
    }
  }

  removeWork(_id: string) {
    this.toDoService.removeWork(_id).subscribe(result => {
      for (let i=0; i<this.works.length; i++) {
        if ( this.works[i]._id == _id ) {
          this.works.splice(i, 1);
          return;
        }
      }
    });
  }

  setToNow(todoDate: HTMLInputElement) {
    todoDate.value = this.getDate();
  }

}
