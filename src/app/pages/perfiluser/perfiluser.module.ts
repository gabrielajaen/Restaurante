import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfiluserPageRoutingModule } from './perfiluser-routing.module';

import { PerfiluserPage } from './perfiluser.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfiluserPageRoutingModule,
    SharedModule
],
  declarations: [PerfiluserPage]
})
export class PerfiluserPageModule {}
