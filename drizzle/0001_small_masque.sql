CREATE TABLE "laporan_pdf" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(200) NOT NULL,
	"judul_laporan" text NOT NULL,
	"nama_file" text NOT NULL,
	"path_file" text NOT NULL,
	"tanggal_upload" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "monitoring_extended" (
	"id" serial PRIMARY KEY NOT NULL,
	"kabupaten" varchar(200) NOT NULL,
	"provinsi" varchar(200),
	"tahun" integer NOT NULL,
	"pola_tanam" varchar(100),
	"jumlah_bibit" integer,
	"tenaga_kerja" integer,
	"hok" integer,
	"luas_tanam" real
);
--> statement-breakpoint
CREATE TABLE "monitoring_lapangan" (
	"id" serial PRIMARY KEY NOT NULL,
	"lokasi" varchar(300) NOT NULL,
	"kabupaten" varchar(200),
	"provinsi" varchar(200),
	"tahun" integer,
	"survival_rate" integer,
	"kerapatan" integer,
	"tinggi_tanaman" integer,
	"foto_url" text,
	"status" varchar(50),
	"catatan" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(200) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "monitoring_data" ALTER COLUMN "luas_target" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "monitoring_data" ALTER COLUMN "luas_tanam" SET DATA TYPE real;