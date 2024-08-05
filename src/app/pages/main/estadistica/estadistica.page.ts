import { Component, OnInit, ChangeDetectorRef, HostListener, AfterViewInit } from '@angular/core';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { ApexAxisChartSeries, ApexChart, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexDataLabels, ApexNonAxisChartSeries } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  title: ApexTitleSubtitle;
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  colors?: string[];
  labels?: string[];
};

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.page.html',
  styleUrls: ['./estadistica.page.scss'],
})
export class EstadisticaPage implements OnInit, AfterViewInit {

  public mostPurchasingUser: string = 'No hay datos';
  public totalEarnings: number = 0; // Nueva variable para las ganancias totales
  public barChartOptions: ChartOptions = {
    series: [
      {
        name: 'Ventas',
        data: []
      }
    ],
    chart: {
      type: 'bar',
      height: this.calculateChartHeight(),
      width: this.calculateChartWidth()
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      title: {
        text: 'Cantidad Vendida'
      }
    },
    title: {
      text: 'Productos Más Vendidos',
      align: 'center'
    },
    plotOptions: {
      bar: {
        columnWidth: '60%'
      }
    },
    colors: ['#16B4CD', '#FF4560', '#008FFB', '#FEB019', '#775DD0']
  };

  public pieChartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    labels: [],
    title: {
      text: 'Distribución de Ventas',
      align: 'center'
    },
    dataLabels: {
      enabled: true
    },
    colors: ['#FF4560', '#008FFB', '#00E396', '#FEB019', '#775DD0']
  };

  private barChart: any;
  private pieChart: any;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadSalesData();
  }

  ngAfterViewInit() {
    window.addEventListener('resize', () => this.updateChartSize());
    this.updateChartSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateChartSize();
  }

  calculateChartHeight(): number {
    return window.innerWidth < 768 ? 300 : 400;
  }

  calculateChartWidth(): number {
    return window.innerWidth < 768 ? 350 : 600;
  }

  updateChartSize() {
    if (this.barChart) {
      this.barChart.updateOptions({
        chart: {
          height: this.calculateChartHeight(),
          width: this.calculateChartWidth(),
        },
        plotOptions: {
          bar: {
            columnWidth: window.innerWidth < 768 ? '70%' : '50%'
          }
        }
      });
    }
    if (this.pieChart) {
      this.pieChart.updateOptions({
        chart: {
          height: this.calculateChartHeight(),
          width: this.calculateChartWidth(),
        }
      });
    }
  }

  async loadSalesData() {
    try {
      const firestore = getFirestore();
      const invoiceRef = collection(firestore, 'facturacion');
      const userRef = collection(firestore, 'users');
      const invoiceSnapshot = await getDocs(invoiceRef);
      const userSnapshot = await getDocs(userRef);

      const productsSales: { [key: string]: number } = {};
      const userPurchases: { [key: string]: number } = {};
      const userMap: { [key: string]: string } = {};
      let totalEarnings: number = 0; // Variable para almacenar las ganancias

      // Mapear userId a nombre
      userSnapshot.docs.forEach(doc => {
        const userData = doc.data();
        const userId = doc.id;
        const userName = userData['nombre'];
        userMap[userId] = userName;
        console.log(`Usuario mapeado: ${userId} -> ${userName}`);
      });

      // Procesar las facturas
      invoiceSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const products = data['products'] || [];
        const userId = data['userId'];

        products.forEach((product: any) => {
          const productName = product.nombre;
          const quantity = product.cantidad;
          const price = product.precio; // Suponiendo que el precio está en el producto

          if (quantity === undefined || quantity === null) {
            console.warn(`Cantidad no definida para el producto ${productName}`);
            return;
          }

          if (productsSales[productName]) {
            productsSales[productName] += quantity;
          } else {
            productsSales[productName] = quantity;
          }

          // Calcular ganancias
          if (price) {
            totalEarnings += quantity * price;
          }
        });

        if (userId) {
          if (userPurchases[userId]) {
            userPurchases[userId] += 1;
          } else {
            userPurchases[userId] = 1;
          }
        }
      });

      // Ordenar los productos por cantidad vendida (descendente)
      const sortedProducts = Object.entries(productsSales)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      // Ordenar los usuarios por número de compras (descendente)
      const sortedUsers = Object.entries(userPurchases)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 1);

      // Configurar datos del gráfico de barras
      this.barChartOptions.series = [
        {
          name: 'Ventas',
          data: sortedProducts.map(entry => entry[1])
        }
      ];
      this.barChartOptions.xaxis = {
        categories: sortedProducts.map(entry => entry[0])
      };

      // Configurar datos del gráfico de pastel
      this.pieChartOptions.series = sortedProducts.map(entry => entry[1]) as ApexNonAxisChartSeries;
      this.pieChartOptions.labels = sortedProducts.map(entry => entry[0]);

      this.barChartOptions.colors = this.barChartOptions.colors.slice(0, sortedProducts.length);
      this.pieChartOptions.colors = this.pieChartOptions.colors.slice(0, sortedProducts.length);

      // Guardar el nombre del usuario con más compras
      const mostPurchasingUserId = sortedUsers[0] ? sortedUsers[0][0] : null;
      this.mostPurchasingUser = mostPurchasingUserId ? userMap[mostPurchasingUserId] || 'Nombre no encontrado' : 'No hay datos';
      
      // Guardar ganancias totales
      this.totalEarnings = totalEarnings;

      // Forzar la detección de cambios
      this.cd.detectChanges();
    } catch (error) {
      console.error('Error al cargar datos de ventas:', error);
    }
  }

  initializeBarChart(chart: any) {
    this.barChart = chart;
    this.updateChartSize();
  }

  initializePieChart(chart: any) {
    this.pieChart = chart;
    this.updateChartSize();
  }
}
