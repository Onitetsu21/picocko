import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SaucesService } from "../services/sauces.service";
import { Sauce } from "../models/Sauce.model";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-sauce-form",
  templateUrl: "./sauce-form.component.html",
  styleUrls: ["./sauce-form.component.scss"],
})
export class SauceFormComponent implements OnInit {
  sauceForm: FormGroup;
  mode: string;
  loading: boolean;
  sauce: Sauce;
  errorMsg: string;
  imagePreview: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private sauces: SaucesService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.route.params.subscribe((params) => {
      if (!params.id) {
        this.mode = "new";
        this.initEmptyForm();
        this.loading = false;
      } else {
        this.mode = "edit";
        this.sauces
          .getSauceById(params.id)
          .then((sauce: Sauce) => {
            this.sauce = sauce;
            this.initModifyForm(sauce);
            this.loading = false;
          })
          .catch((error) => {
            this.errorMsg = JSON.stringify(error);
          });
      }
    });
  }

  initEmptyForm() {
    this.sauceForm = this.formBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("[a-zA-Z0-9s]*"),
        ],
      ],
      manufacturer: [
        null,
        [
          Validators.required,
          Validators.maxLength(75),
          Validators.pattern("[a-zA-Z0-9s]*"),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern("[a-zA-Z0-9s]*"),
        ],
      ],
      image: [null, Validators.required],
      mainingredient: [
        null,
        [
          Validators.required,
          Validators.maxLength(75),
          Validators.pattern("[a-zA-Z0-9s]*"),
        ],
      ],
      heat: [1, Validators.required],
      heatValue: [{ value: 1, disabled: true }],
    });
    this.sauceForm.get("heat").valueChanges.subscribe((value) => {
      this.sauceForm.get("heatValue").setValue(value);
    });
  }

  initModifyForm(sauce: Sauce) {
    this.sauceForm = this.formBuilder.group({
      name: [
        this.sauce.name,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("[a-zA-Z0-9s]*"),
        ],
      ],
      manufacturer: [
        this.sauce.manufacturer,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("[a-zA-Z0-9s]*"),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern("[a-zA-Z0-9s]*"),
        ],
      ],
      image: [this.sauce.imageUrl, Validators.required],
      mainingredient: [
        this.sauce.mainingredient,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern("[a-zA-Z0-9s]*"),
        ],
      ],
      heat: [this.sauce.heat, Validators.required],
      heatValue: [{ value: this.sauce.heat, disabled: true }],
    });
    this.sauceForm.get("heat").valueChanges.subscribe((value) => {
      this.sauceForm.get("heatValue").setValue(value);
    });
    this.imagePreview = this.sauce.imageUrl;
  }

  onSubmit() {
    this.loading = true;
    const newSauce = new Sauce();
    newSauce.name = this.sauceForm.get("name").value;
    newSauce.manufacturer = this.sauceForm.get("manufacturer").value;
    newSauce.description = this.sauceForm.get("description").value;
    newSauce.mainingredient = this.sauceForm.get("mainingredient").value;
    newSauce.heat = this.sauceForm.get("heat").value;
    newSauce.userId = this.auth.getUserId();
    if (
      !newSauce.name ||
      !newSauce.manufacturer ||
      !newSauce.description ||
      !newSauce.mainingredient ||
      !newSauce.heat ||
      !newSauce.userId
    ) {
      this.loading = false;
      return;
    }
    if (this.mode === "new") {
      this.sauces
        .createSauce(newSauce, this.sauceForm.get("image").value)
        .then((response: { message: string }) => {
          console.log(response.message);
          this.loading = false;
          this.router.navigate(["/sauces"]);
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
          this.errorMsg = error.message;
        });
    } else if (this.mode === "edit") {
      this.sauces
        .modifySauce(
          this.sauce._id,
          newSauce,
          this.sauceForm.get("image").value
        )
        .then((response: { message: string }) => {
          console.log(response.message);
          this.loading = false;
          this.router.navigate(["/sauces"]);
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
          this.errorMsg = error.message;
        });
    }
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log("file ===>", file);
    this.sauceForm.get("image").setValue(file);
    this.sauceForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
