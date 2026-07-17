import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators
 } from '@angular/forms';
import {Router} from '@angular/router';
import { TaskService } from '../../services/task.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-ddashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './ddashboard.component.html',
  styleUrls: ['./ddashboard.component.scss']
})
export class DdashboardComponent implements OnInit {

  private taskService = inject(TaskService);
  private fb= inject(FormBuilder);
  private router= inject(Router);
  private snackBar= inject(MatSnackBar);

  tasks: any[] = [];

  filteredTasks: any[] = [];

  searchText = '';

  totalTasks = 0;

  pendingTasks = 0;

  completedTasks = 0;

  highPriorityTasks = 0;
  editingTaskId: string | null = null;

  taskForm=this.fb.group({
    title: ['', Validators.required],
    description: [''],
    status: ['Pending'],
    priority: ['Medium']
  });

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {

    this.taskService.getTasks().subscribe({

      next: (tasks: any) => {

        this.tasks = tasks;

        this.filteredTasks = tasks;

        this.calculateStatistics();

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  calculateStatistics() {

    this.totalTasks = this.tasks.length;

    this.pendingTasks =
      this.tasks.filter(
        task => task.status === 'Pending'
      ).length;

    this.completedTasks =
      this.tasks.filter(
        task => task.status === 'Completed'
      ).length;

    this.highPriorityTasks =
      this.tasks.filter(
        task => task.priority === 'High'
      ).length;

  }

  searchTasks() {

    this.filteredTasks =
      this.tasks.filter(task =>

        task.title
          .toLowerCase()
          .includes(
            this.searchText.toLowerCase()
          )

      );

  }

createTask() {

  if (this.taskForm.invalid) {
    return;
  }

  const taskData = this.taskForm.value;

  if (this.editingTaskId) {

    this.taskService.updateTask(this.editingTaskId, taskData).subscribe({

      next: () => {

        this.loadTasks();

        this.taskForm.reset({
          status: 'Pending',
          priority: 'Medium'
        });

        this.editingTaskId = null;

        this.snackBar.open(
          'Task updated successfully!',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

      },

      error: (err) => {

        console.error(err);

        this.snackBar.open(
          'Unable to update task.',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

      }

    });

  } else {

    this.taskService.createTask(taskData).subscribe({

      next: () => {

        this.loadTasks();

        this.taskForm.reset({
          status: 'Pending',
          priority: 'Medium'
        });

        this.snackBar.open(
          'Task created successfully!',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

      },

      error: (err) => {

        console.error(err);

        this.snackBar.open(
          'Unable to create task.',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        );

      }

    });

  }

}
deleteTask(id: string) {

  if (!confirm('Delete this task?')) {
    return;
  }

  this.taskService.deleteTask(id).subscribe({

    next: () => {

      this.loadTasks();

      this.snackBar.open(
        'Task deleted successfully!',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );

    },

    error: (err) => {

      console.error(err);

      this.snackBar.open(
        'Unable to delete task.',
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );

    }

  });

}

editTask(task: any) {

  this.editingTaskId = task._id;

  this.taskForm.patchValue({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}
cancelEdit() {

  this.editingTaskId = null;

  this.taskForm.reset({

    status: 'Pending',
    priority: 'Medium'

  });

}
logout() {

  localStorage.removeItem('token');

  this.router.navigate(['/login']);

}


}