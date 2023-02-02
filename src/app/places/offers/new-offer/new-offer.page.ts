import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  form!: FormGroup;

  constructor(
    private placesService: PlacesService,
    private router: Router,
    private loaderController: LoadingController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(20)],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)],
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required],
      }),
      location: new FormControl(null, { validators: Validators.required }),
    });
  }

  onLocationPicked(location: PlaceLocation) {
    console.log(location);

    this.form.patchValue({ location: location });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loaderController
      .create({
        message: 'Creating place...',
      })
      .then((loadingElement) => {
        loadingElement.present();
        this.placesService
          .addPlace(
            this.form.value['title'],
            this.form.value['description'],
            +this.form.value['price'],
            new Date(this.form.value['dateFrom']),
            new Date(this.form.value['dateTo']),
            this.form.value['location']
          )
          .subscribe(() => {
            loadingElement.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
