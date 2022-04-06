import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LoginGuardGuard } from './shared/guard/login.guard';
import { AuthGuard } from './shared/guard/auth.guard';


const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      useHash: true
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
