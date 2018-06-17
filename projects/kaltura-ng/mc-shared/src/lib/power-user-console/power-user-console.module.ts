import { NgModule } from '@angular/core';
import { PowerUserConsoleComponent } from "./power-user-console.component";
import { CommonModule } from "@angular/common";
import { DropdownModule, SidebarModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

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