import { Component } from '@angular/core';
import { LugaresComponent } from '../home/lugares/lugares.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LugaresComponent],
})
export class HomePage {
  constructor() {}
}
