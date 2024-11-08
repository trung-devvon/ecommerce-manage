// Lớp Point đại diện cho một điểm trong không gian 2D
export class Point {
    X: number;
    Y: number;
  
    constructor(x: number, y: number) {
      this.X = x;
      this.Y = y;
    }
  }
  
  // Lớp Rectangle để tính toán bounding box
  class Rectangle {
    X: number;
    Y: number;
    Width: number;
    Height: number;
  
    constructor(x: number, y: number, width: number, height: number) {
      this.X = x;
      this.Y = y;
      this.Width = width;
      this.Height = height;
    }
  }
  
  // Lớp Template lưu trữ mẫu gesture
  class Template {
    Points: Point[];
    Name: string;
  
    constructor(name: string, points: Point[]) {
      this.Name = name;
      this.Points = points;
    }
  }
  
  // Lớp chính PDollarRecognizer
  export class PDollarRecognizer {
    private templates: Template[] = [];
    private readonly numPoints = 32;
    private readonly squareSize = 250.0;
    private readonly origin = new Point(0, 0);
    private readonly diagonal = Math.sqrt(this.squareSize * this.squareSize + this.squareSize * this.squareSize);
    private readonly halfDiagonal = 0.5 * this.diagonal;
  
    constructor() {
      this.templates = [];
    }
  
    // Thêm một mẫu gesture mới
    AddGesture(name: string, points: Point[]) {
      this.templates.push(new Template(name, this.Resample(points)));
    }
  
    // Nhận dạng một gesture
    Recognize(points: Point[]) {
      points = this.Resample(points);
      let b = Infinity;
      let selected = -1;
  
      for (let i = 0; i < this.templates.length; i++) {
        const d = this.DistanceAtBestAngle(points, this.templates[i]);
        if (d < b) {
          b = d;
          selected = i;
        }
      }
  
      const score = selected === -1 ? 0.0 : 1.0 - b / this.halfDiagonal;
      return { Name: selected === -1 ? "No match." : this.templates[selected].Name, Score: score };
    }
  
    // Lấy mẫu lại các điểm để có số điểm chuẩn
    private Resample(points: Point[]): Point[] {
      const interval = this.PathLength(points) / (this.numPoints - 1);
      let D = 0.0;
      const newPoints: Point[] = [points[0]];
  
      for (let i = 1; i < points.length; i++) {
        const d = this.Distance(points[i - 1], points[i]);
        if ((D + d) >= interval) {
          const qx = points[i - 1].X + ((interval - D) / d) * (points[i].X - points[i - 1].X);
          const qy = points[i - 1].Y + ((interval - D) / d) * (points[i].Y - points[i - 1].Y);
          const point = new Point(qx, qy);
          newPoints.push(point);
          points.splice(i, 0, point);
          D = 0.0;
        } else {
          D += d;
        }
      }
  
      while (newPoints.length < this.numPoints) {
        newPoints.push(points[points.length - 1]);
      }
  
      return newPoints;
    }
  
    // Tính khoảng cách giữa hai điểm
    private Distance(p1: Point, p2: Point): number {
      const dx = p2.X - p1.X;
      const dy = p2.Y - p1.Y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    // Tính độ dài đường đi qua tất cả các điểm
    private PathLength(points: Point[]): number {
      let length = 0;
      for (let i = 1; i < points.length; i++) {
        length += this.Distance(points[i - 1], points[i]);
      }
      return length;
    }
  
    // Tìm góc tốt nhất để so sánh hai gesture
    private DistanceAtBestAngle(points: Point[], template: Template): number {
      const φ = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
      let θa = -45.0 * Math.PI / 180.0;
      let θb = 45.0 * Math.PI / 180.0;
      const θδ = 2.0 * Math.PI / 180.0;
      
      let x1 = φ * θa + (1.0 - φ) * θb;
      let f1 = this.DistanceAtAngle(points, template, x1);
      let x2 = (1.0 - φ) * θa + φ * θb;
      let f2 = this.DistanceAtAngle(points, template, x2);
  
      while (Math.abs(θb - θa) > θδ) {
        if (f1 < f2) {
          θb = x2;
          x2 = x1;
          f2 = f1;
          x1 = φ * θa + (1.0 - φ) * θb;
          f1 = this.DistanceAtAngle(points, template, x1);
        } else {
          θa = x1;
          x1 = x2;
          f1 = f2;
          x2 = (1.0 - φ) * θa + φ * θb;
          f2 = this.DistanceAtAngle(points, template, x2);
        }
      }
  
      return Math.min(f1, f2);
    }
  
    // Tính khoảng cách tại một góc cụ thể
    private DistanceAtAngle(points: Point[], template: Template, θ: number): number {
      const newPoints = this.RotateBy(points, θ);
      return this.PathDistance(newPoints, template.Points);
    }
  
    // Xoay các điểm theo một góc
    private RotateBy(points: Point[], θ: number): Point[] {
      const centroid = this.Centroid(points);
      const cos = Math.cos(θ);
      const sin = Math.sin(θ);
  
      const newPoints: Point[] = [];
      for (const point of points) {
        const qx = (point.X - centroid.X) * cos - (point.Y - centroid.Y) * sin + centroid.X;
        const qy = (point.X - centroid.X) * sin + (point.Y - centroid.Y) * cos + centroid.Y;
        newPoints.push(new Point(qx, qy));
      }
      return newPoints;
    }
  
    // Tính điểm trung tâm của một tập hợp điểm
    private Centroid(points: Point[]): Point {
      let x = 0.0, y = 0.0;
      for (const point of points) {
        x += point.X;
        y += point.Y;
      }
      x /= points.length;
      y /= points.length;
      return new Point(x, y);
    }
  
    // Tính tổng khoảng cách giữa các điểm tương ứng
    private PathDistance(pts1: Point[], pts2: Point[]): number {
      let distance = 0;
      for (let i = 0; i < pts1.length; i++) {
        distance += this.Distance(pts1[i], pts2[i]);
      }
      return distance / pts1.length;
    }
  }