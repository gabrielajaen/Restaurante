  import { Injectable, inject } from '@angular/core';
  import { AngularFireAuth } from '@angular/fire/compat/auth';
  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
  } from 'firebase/auth';
  import { User } from '../models/user.model';
  import { AngularFirestore } from '@angular/fire/compat/firestore';
  import {
    getFirestore,
    setDoc,
    doc,
    getDoc,
    addDoc,
    collection,
    collectionData,
    query,
    updateDoc,deleteDoc,
    where,
    docData,
    getDocs
  } from '@angular/fire/firestore';
  import { UtilsService } from './utils.service';
  import { AngularFireStorage } from '@angular/fire/compat/storage';
  import {
    getStorage,
    uploadString,
    ref,
    getDownloadURL, deleteObject
  } from 'firebase/storage';
  import { map, Observable, of, switchMap } from 'rxjs';
  import { Platos } from '../models/platos.model';
  import { Carrito } from '../models/carrito.model';
  
  @Injectable({
    providedIn: 'root',
  })
  export class FirebaseService {
    auth = inject(AngularFireAuth);
    firestore = inject(AngularFirestore);
    utilSvc = inject(UtilsService);
    storage = inject(AngularFireStorage);
  
    //RutasAcceso
    getauth() {
      return getAuth();
    }
    //Ingreso
    singIn(user: User) {
      return signInWithEmailAndPassword(getAuth(), user.email, user.password);
    }
  
    //Registrarse
    singUp(user: User) {
      return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
    }
  
    //Actualizar Usuario
    updateUser(displayName: string) {
      return updateProfile(getAuth().currentUser, { displayName });
    }
  
    //Cerar Sesion
    salir() {
      getAuth().signOut();
      localStorage.removeItem('user');
      this.utilSvc.routerLink('/home');
    }
  
    //Recuperar Contraseña
    recoveryEmail(email: string) {
      return sendPasswordResetEmail(getAuth(), email);
    }
  
    //Base de Datos
    //Seleccionar un documento
    setDocument(path: string, data: any) {
      return setDoc(doc(getFirestore(), path), data);
    }
    //Actualizar un documento
    updateDocument(path: string, data: any) {
      return updateDoc(doc(getFirestore(), path), data);
    }
  
    //Eliminar un documento
    deleteDocument(path: string) {
      return deleteDoc(doc(getFirestore(), path));
    }
  
    //Obtener un documento
    async getDocument(path: string) {
      return (await getDoc(doc(getFirestore(), path))).data();
    }
  
    //Agregar producto
    addDocument(path: string, data: any) {
      return addDoc(collection(getFirestore(), path), data);
    }
  
    //Obtener EMail
    getUserByEmail(email: string): Observable<any> {
      const usersCollection = collection(getFirestore(), 'users');
      const q = query(usersCollection, where('email', '==', email));
      return collectionData(q, { idField: 'id' }) as Observable<any[]>;
    }
  
   // Obtener platos por ID de usuario
   getDishesByUserId(uid: string): Observable<Platos[]> {
    const dishesRef = collection(getFirestore(), `users/${uid}/products`);
    return collectionData(dishesRef, { idField: 'id' }) as Observable<Platos[]>;
  }
  
  // Obtener plato específico
  getDishById(uid: string, dishId: string): Observable<Platos> {
    const dishRef = doc(getFirestore(), `users/${uid}/products/${dishId}`);
    return docData(dishRef, { idField: 'id' }) as Observable<Platos>;
  }
  
  
  
    
    //Mostrar producto
    obtenerDatos(path: string, collectionquery?: any) {
      const ref = collection(getFirestore(), path);
      return collectionData(query(ref, collectionquery), { idField: 'id' });
    }
  
    //ALMACENAR LAS IMAGENES EN STORAGE DE FIREBASE OBTENER URL
    async subirImagen(path: string, dataUrl: string): Promise<string> {
      // Limpiar la cadena dataUrl para obtener solo la parte Base64
      let base64Image = this.obtenerBase64(dataUrl);
  
    // Subir imagen usando uploadString
      return uploadString(ref(this.storage.storage, path), base64Image, 'base64').then(() => {
        return getDownloadURL(ref(this.storage.storage, path));
      }).catch(error => {
        console.error('Error al subir la imagen:', error);
        throw error; // Propagar el error para manejarlo en el componente que llama a subirImagen
      });
    }
  
    // Función para obtener la parte Base64 de la URL de datos
    private obtenerBase64(dataUrl: string): string {
      // Verificar y limpiar el dataUrl si es necesario
      let base64String = dataUrl.split(',')[1]; // Obtener solo la parte Base64 después de la coma
      return base64String || '';
    }
  
    //Obtener ruta de la imagen
    async getFilePath(url: string): Promise<string> {
      return ref(getStorage(), url).fullPath;
    }
  
    //Eliminar datos del storage
    deletefile(path: string){
    return deleteObject(ref(getStorage(), path))
    }
  
    async addToCart(userId: string, carritoItem: Carrito) {
      const carritoRef = collection(getFirestore(), `users/${userId}/carrito`);
      const q = query(carritoRef, where('id', '==', carritoItem.id));
      
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // El producto ya está en el carrito, actualiza la cantidad
          const docId = querySnapshot.docs[0].id;
          const existingItem = querySnapshot.docs[0].data() as Carrito;
          const newCantidad = existingItem.cantidad + carritoItem.cantidad;
          await updateDoc(doc(carritoRef, docId), { cantidad: newCantidad });
          console.log('Cantidad actualizada en el carrito');
        } else {
          // El producto no está en el carrito, agregarlo
          await addDoc(carritoRef, carritoItem);
          console.log('Plato agregado al carrito con éxito');
        }
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
        throw error;
      }
    }
  
    
  
    // EditarPerfil
  updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
    return updateDoc(doc(getFirestore(), `users/${uid}`), data);
  }
  //Editar Imagen
  async updateUserImage(uid: string, imageDataUrl: string): Promise<void> {
    try {
      // Subir la nueva imagen
      const imagePath = `users/${uid}/profile.jpg`; // Define la ruta donde se almacenará la imagen
      const imageUrl = await this.subirImagen(imagePath, imageDataUrl);
  
      // Actualizar la URL de la imagen en Firestore
      await this.updateUserProfile(uid, { imagen: imageUrl });
    } catch (error) {
      console.error('Error al actualizar la imagen del perfil:', error);
      throw error;
    }
  }
  
  // Restablecer contraseña
  async reauthenticateUser(email: string, currentPassword: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    const credential = EmailAuthProvider.credential(email, currentPassword);

    try {
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.error('Error en la reautenticación:', error);
      throw new Error('Error en la reautenticación. Verifica las credenciales.');
    }
  }

  
  async changePassword(newPassword: string): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    try {
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw new Error('Error al cambiar la contraseña. Inténtalo de nuevo.');
    }
  }


  getCurrentUser(): Observable<any> {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRef = doc(getFirestore(), `users/${user.uid}`);
      return docData(userRef, { idField: 'id' }) as Observable<any>;
    }

    return of(null);
  }

  

  // Obtener URL de la imagen del perfil del usuario
  getUserProfileImage(uid: string): Observable<string> {
    const userDocRef = doc(getFirestore(), `users/${uid}`);
    return docData(userDocRef).pipe(
      map((userData: any) => userData?.imagen || '')
    );
  }

  //Carrito
  async getCartItem(userId: string, productId: string): Promise<Carrito | null> {
    const carritoRef = collection(getFirestore(), `users/${userId}/carrito`);
    const q = query(carritoRef, where('id', '==', productId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Carrito;
    }
    return null;
  }
  
  
 
  }
  