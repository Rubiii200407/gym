import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IClasesOnline } from '../clases-online.model';
import { ClasesOnlineService } from '../service/clases-online.service';
import { ClasesOnlineFormGroup, ClasesOnlineFormService } from './clases-online-form.service';

@Component({
  selector: 'jhi-clases-online-update',
  templateUrl: './clases-online-update.component.html',
})
export class ClasesOnlineUpdateComponent implements OnInit {
  isSaving = false;
  clasesOnline: IClasesOnline | null = null;
  claseSeleccionado?:string|null;
  horasDisponibles: string[] = [];
  horaClase: string = ""
  codigo?: string;
  nuevaConsulta = true;
  uuid?:string
  guardado=false;
  codigoNoExiste = false;
 claseBuscada: IClasesOnline | null = null;
  codigoBusqueda = '';
  editForm: ClasesOnlineFormGroup = this.clasesOnlineFormService.createClasesOnlineFormGroup();
  detallesClases:Record<string,string>= {
    "EntrenamientoFuncional": "El entrenamiento funcional es una combinación de ejercicios centrados en el propio peso corporal y movimientos funcionales que mejoren la fuerza, la resistencia y la movilidad.",
    "Yoga": "El yoga es una práctica que conecta el cuerpo, la respiración y la mente. Esta práctica utiliza posturas físicas, ejercicios de respiración y meditación para mejorar la salud general.",
    "HIIT":"El HIIT consiste en sesiones cortas e intensas que alternan entre ráfagas de ejercicios vigorosos y períodos de descanso, efectivas para quemar calorías y mejorar la condición física.",
    "BaileCardiovascular":"El baile cardiovascular son coreografías divertidas y dinámicas que combinan baile con ejercicios cardiovasculares para mejorar la coordinación y el estado físico.",
    "Pilates": "Pilates es un método gimnástico que aúna el ejercicio corporal con el control mental, basado en la respiración y la relajación",
    "Boxeo":"El boxeo es un deporte que consiste en la lucha a puñetazos de dos contendientes, de conformidad con ciertas reglas y utilizando guantes especiales.",
  };
  horariosPorDiaYClase: Record<string, Record<string, string[]>> = {
    'Monday': {
      'EntrenamientoFuncional': ['08:00 AM', '10:00 AM', '14:00 PM'],
      'Yoga': ['09:00 AM', '11:00 AM', '15:00 PM'],
      'HIIT': ['10:00 AM', '12:00 AM', '17:00 PM'],
      'BaileCardiovascular': ['11:00 AM', '12:00 AM', '19:00 PM'],
      'Pilates': ['08:30 AM', '9:30 AM', '18:00 PM'],
      'Boxeo': ['09:30 AM', '11:30 AM', '20:00 PM'],
      
    },
    'Tuesday': {
      'EntrenamientoFuncional': ['09:00 AM', '11:00 AM', '15:00 PM'],
      'Yoga': ['10:00 AM', '12:00 PM', '16:00 PM'],
      'HIIT': ['11:00 AM', '14:00 AM', '18:00 PM'],
      'BaileCardiovascular': ['09:30 AM', '10:00 AM', '17:00 PM'],
      'Pilates': ['08:00 AM', '10:00 AM', '19:00 PM'],
      'Boxeo': ['12:00 AM', '15:00 AM', '20:00 PM'],
    },
    'Wednesday': {
      'EntrenamientoFuncional': ['10:00 AM', '12:00 PM', '16:00 PM'],
      'Yoga': ['11:00 AM', '13:00 PM', '17:00 PM'],
      'HIIT': ['08:30 AM', '10:00 AM', '19:00 PM'],
      'BaileCardiovascular': ['10:00 AM', '11:30 AM', '20:00 PM'],
      'Pilates': ['08:00 AM', '10:30 AM', '20:00 PM'],
      'Boxeo': ['09:30 AM', '11:00 AM', '21:00 PM'],
    },
    'Thursday': {
      'EntrenamientoFuncional': ['11:00 AM', '17:00 PM', '20:00 PM'],
      'Yoga': ['12:00 PM', '14:00 PM', '18:00 PM'],
      'HIIT': ['08:00 AM', '11:00 AM', '16:00 PM'],
      'BaileCardiovascular': ['09:00 AM', '11:00 AM', '15:00 PM'],
      'Pilates': ['08:30 AM', '10:30 AM', '14:00 PM'],
      'Boxeo': ['09:30 AM', '11:30 AM', '19:00 PM'],
    },
    'Friday': {
      'EntrenamientoFuncional': ['12:00 PM', '14:00 PM', '18:00 PM'],
      'Yoga': ['13:00 PM', '15:30 PM', '19:00 PM'],
      'HIIT': ['08:30 AM', '11:00 AM', '17:00 PM'],
      'BaileCardiovascular': ['09:00 AM', '12:00 AM', '16:00 PM'],
      'Pilates': ['08:00 AM', '10:30 AM', '20:00 PM'],
      'Boxeo': ['09:30 AM', '11:30 AM', '21:00 PM'],
    },
    'Saturday': {
      'EntrenamientoFuncional': ['9:00 PM', '13:00 PM', '18:00 PM'],
      'Yoga': ['11:00 PM', '15:30 PM', '17:00 PM'],
      'HIIT': ['08:30 AM', '11:00 AM', '19:00 PM'],
      'BaileCardiovascular': ['10:00 AM', '12:00 AM', '16:00 PM'],
      'Pilates': ['09:00 AM', '11:30 AM', '19:00 PM'],
      'Boxeo': ['09:30 AM', '12:30 AM', '16:00 PM'],
    },
    'Sunday': {
      'EntrenamientoFuncional': ['9:00 PM', '14:00 PM'],
      'Yoga': ['8:00 PM', '13:0 PM',],
      'HIIT': ['08:30 AM', '11:00 AM', ],
      'BaileCardiovascular': ['09:30 AM','11:00 AM' ],
      'Pilates': ['10:00 AM', '13:30 AM', ],
      'Boxeo': [ '12:30 AM',],
    },
  
  };
  descripcionClase :string=""
  constructor(
    protected clasesOnlineService: ClasesOnlineService,
    protected clasesOnlineFormService: ClasesOnlineFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ clasesOnline }) => {
      this.clasesOnline = clasesOnline;
      if (clasesOnline) {
        this.updateForm(clasesOnline);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.guardado = true;
    this.isSaving = true;
    const clasesOnline = this.clasesOnlineFormService.getClasesOnline(this.editForm);
  
    if (clasesOnline.id !== null) {
      this.subscribeToSaveResponse(this.clasesOnlineService.update(clasesOnline));
    } else {
      this.clasesOnlineService.create(clasesOnline).subscribe(
        (clase) => {
          this.codigo = clase.body?.codigo ?? '';
          this.descargarCodigo(this.codigo);
        },
      );
    }
 
}
descargarCodigo(codigo: string): void {
  const blob = new Blob([codigo], { type: 'text/plain' });
  const data = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = data;
  link.download = 'codigo_de_seguimiento';
  link.click();
  window.URL.revokeObjectURL(data);
}
buscarUUID(): void {
    this.clasesOnlineService.findUUID(this.codigoBusqueda).subscribe(
      clase => {
        if (clase !== null) {
          this.claseBuscada = clase.body;
          this.codigoNoExiste = false;
        } else {
          this.claseBuscada = null;
          this.codigoNoExiste = true;
        }
      },
      error => {
        this.claseBuscada = null;
        this.codigoNoExiste = true;
      }
    );
  }

  seleccionarDeporte(clasesOnline: string) {
    this.claseSeleccionado = clasesOnline;
    this.actualizarHorasDisponibles();
  }
  detallesDeporte(clasesOnline:string){
    this.editForm.controls["descripcion"].setValue(this.detallesClases[clasesOnline])
  }
  mostrarDetalles(clasesOnline:string){
    this.descripcionClase=this.detallesClases[clasesOnline];

  }
  seleccionarHora(hora: string) {
    this.editForm.get('horaClase')?.setValue(hora);
  }
  actualizarHorasDisponibles(): void {
    const fechaSeleccionadaStr: Date | null = this.editForm.get('fechaClase')?.value || null;
    const fechaSeleccionada: Date | null = fechaSeleccionadaStr ? new Date(fechaSeleccionadaStr) : null;
  
    if (fechaSeleccionada) {
      const diaSeleccionado = this.obtenerDiaSemana(fechaSeleccionada);
  
      if (diaSeleccionado && this.horariosPorDiaYClase[diaSeleccionado]) {
        const horasDeporte = this.horariosPorDiaYClase[diaSeleccionado][this.claseSeleccionado || ''];
  
        if (horasDeporte) {
          this.horasDisponibles = horasDeporte;
          console.log('Horas disponibles:', this.horasDisponibles);
        } else {
          this.horasDisponibles = [];
        }
      } else {
        this.horasDisponibles = [];
      }
    } else {
      this.horasDisponibles = [];
    }
  }
  obtenerDiaSemana(fecha: Date | null | undefined): string | null {
    if (!fecha || !(fecha instanceof Date)) {
      return null;
    }
  
    const diasSemana = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return diasSemana[fecha.getDay()];
  } 

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClasesOnline>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(clasesOnline: IClasesOnline): void {
    this.clasesOnline = clasesOnline;
    this.clasesOnlineFormService.resetForm(this.editForm, clasesOnline);
  }
}
