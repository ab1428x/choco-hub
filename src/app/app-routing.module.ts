import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BayComponent } from './bay/bay.component';
import { LibraryComponent } from './library/library.component';

const routes: Routes = [
  {
    path: '', redirectTo: 'bay', pathMatch: 'full'
  },
  {
    path: 'bay', component: BayComponent
  },
  {
    path: 'library', component: LibraryComponent, data: { pathDesc : 'library' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
