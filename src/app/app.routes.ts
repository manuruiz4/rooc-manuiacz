import { Routes } from '@angular/router';
import { CardsCalculatorComponent } from './pages/cards-calculator.component';
import { EnchantsComponent } from './pages/enchants.component';
import { FeathersCalculatorComponent } from './pages/feathers-calculator.component';
import { HomeComponent } from './pages/home.component';
import { PetsComponent } from './pages/pets.component';

export const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		title: 'ROOC - Home'
	},
	{
		path: 'calculator',
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'feathers'
			},
			{
				path: 'feathers',
				component: FeathersCalculatorComponent,
				title: 'ROOC - Feathers Calculator'
			},
			{
				path: 'cards',
				component: CardsCalculatorComponent,
				title: 'ROOC - Cards Calculator'
			}
		]
	},
	{
		path: 'pets',
		component: PetsComponent,
		title: 'ROOC - Pets'
	},
	{
		path: 'enchants',
		component: EnchantsComponent,
		title: 'ROOC - Enchants'
	},
	{
		path: '**',
		redirectTo: ''
	}
];
