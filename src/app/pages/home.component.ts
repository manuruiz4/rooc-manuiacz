import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <section class="page-shell">
      <p class="eyebrow">Ragnarok Online Guide</p>
      <h1>Welcome, Adventurer</h1>
      <p class="lead">
        Your starter hub for builds, calculators, pets, and enchants.
        More tools and guides can be added as we grow the site.
      </p>
    </section>
  `
})
export class HomeComponent {}
