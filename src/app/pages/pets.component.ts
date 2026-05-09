import { Component } from '@angular/core';

@Component({
  selector: 'app-pets',
  standalone: true,
  template: `
    <section class="page-shell">
      <p class="eyebrow">Companion System</p>
      <h1>Pets</h1>
      <p class="lead">
        Placeholder page for pet taming, loyalty, food, and companion progression guides.
      </p>
    </section>
  `
})
export class PetsComponent {}
