import { NgModule } from '@angular/core';
import { PowerUserConsoleComponent } from './power-user-console.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  imports: [
    CommonModule,
    SidebarModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [
    PowerUserConsoleComponent
  ],
  exports: [
    PowerUserConsoleComponent
  ]
})
export class PowerUserConsoleModule {
}
