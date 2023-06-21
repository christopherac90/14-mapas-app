import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FlightService } from '../../services';
import { NewFlight } from '../../interfaces/flight';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-nuevo-vuelo',
  templateUrl: './nuevo-vuelo.component.html',
  styleUrls: ['./nuevo-vuelo.component.css']
})
export class NuevoVueloComponent implements AfterViewInit {

  @ViewChild('closebutton') closebutton:any;
  @ViewChild('modalNuevoVuelo') modalNuevo?: ElementRef;

  ngAfterViewInit() {
    
    this.modalNuevo?.nativeElement.addEventListener('shown.bs.modal', () => {
       this.formulario.reset();
       this.formulario.controls['horas'].setValue('0')
    });
   
   }
  
  private fb = inject(FormBuilder);

  constructor(){ }

  public formulario:FormGroup = this.fb.group({
    nombrePiloto: ['', [Validators.required, Validators.minLength(10) ]],
    marca: ['', [Validators.required, Validators.minLength(3)]],
    horas: ['0', [Validators.required, Validators.min(1) ]],
    tipo: ['', [Validators.required]]
  });


  private flightService = inject(FlightService);

  isValidField(field:string): boolean | null{
    return this.formulario.controls[field].errors 
    && this.formulario.controls[field].touched;    
  }

  
  getFieldError(field:string): string | null{
    
    
    if(!this.formulario.controls[field]) return null;
    const  errors = this.formulario.controls[field].errors || {};
    for (const key of Object.keys(errors)) {
      switch(key){
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
        case 'min':
            return `El valor mínimo debe de ser ${errors['min'].min}`;
      }
    }
    return ''
  }


  saveFlight(){
    if(!this.formulario) throw Error('No existe el formulario');

    if(this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return};

    // if(!this.formulario.valid) {
    //   alert('Algunos campos requeridos deben ser llenados.');
    // return;

    // }

    
    const newFlight = {
      brand: this.formulario.controls['marca'].value,
      name: this.formulario.controls['nombrePiloto'].value,
      minutesFlyTime: this.formulario.controls['horas'].value,
      flyType: this.formulario.controls['tipo'].value
      } as NewFlight;
    
      var resultSave = this.flightService.saveFlight(newFlight)
      .subscribe({
        next: (res)=> {
          if(res.code == 0){

          this.closebutton.nativeElement.click();
          this.formulario.reset();
          
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tu viaje ha sido guardado de forma exitosa',
            showConfirmButton: false,
            timer: 1500
          })
        }
        else{

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error mientras guardabamos tu viaje'
          })
        }
        },

        error:(message) =>{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error mientras guardabamos tu viaje'
          })
        }


      });
  }

}
