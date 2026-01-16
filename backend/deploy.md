# cPanel Deployment Instructions

This guide outlines the steps to deploy the PHP Admin Dashboard to a shared hosting environment using cPanel.

## Prerequisites

- Access to cPanel.
- A domain or subdomain configured in cPanel.
- An FTP client (like FileZilla) or access to cPanel File Manager.

## Step 1: Prepare the Build

Before uploading, you need to ensure all assets are compiled.

1.  **Build Tailwind CSS:**
    Run the following command on your local machine to generate the final CSS file:
    ```bash
    cd backend
    pnpm install
    pnpm run build
    ```
    This will create/update `public/css/style.css`.

2.  **Clean Up:**
    Remove `node_modules` and `.git` folders if you are copying the folder directly, as they are not needed on the server.
    *Note: The `vendor` folder is required. If it's missing, run `composer install` locally before uploading.*

## Step 2: Upload Files

1.  **Open File Manager** in cPanel or connect via FTP.
2.  Navigate to the `public_html` directory (or the specific directory for your subdomain).
3.  **Upload** the entire contents of the `backend` folder to your server directory.
    - If you are deploying to `example.com`, the contents of `backend/public` should technically be the document root, but for shared hosting, it is often easier to:
        - Upload everything to a non-public folder (e.g., `~/php-admin`) and symlink `public` to `public_html`.
        - **OR (Simpler method for most users):**
            1. Upload all files from `backend/` to your project folder (e.g. `public_html/admin` or just `public_html`).
            2. Point your domain's **Document Root** to the `public` folder inside the uploaded directory.

    **Recommended Structure on Server:**
    ```
    /home/username/public_html/
    ├── .env                <-- Create this file
    ├── composer.json
    ├── config/
    ├── public/             <-- Point Domain Document Root here
    │   ├── index.php
    │   ├── css/
    │   └── ...
    ├── src/
    ├── vendor/
    └── views/
    ```

## Step 3: Database Setup

1.  **Create Database:**
    - Go to **MySQL Database Wizard** in cPanel.
    - Create a new database (e.g., `username_newsviewbd`).
    - Create a new user (e.g., `username_admin`) and generate a strong password.
    - Add the user to the database with **ALL PRIVILEGES**.

2.  **Import Schema:**
    - Go to **phpMyAdmin** in cPanel.
    - Select the newly created database.
    - Click **Import**.
    - Choose the `schema.sql` file from the `backend` folder.
    - Click **Go** to create the tables.

## Step 4: Configuration

1.  **Environment Variables:**
    - Rename `.env.example` to `.env` on the server.
    - Edit `.env` and update the database credentials:

    ```env
    APP_NAME="NewsViewBD Admin"
    APP_ENV=production
    APP_URL=https://yourdomain.com

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=username_newsviewbd
    DB_USERNAME=username_admin
    DB_PASSWORD=your_strong_password
    ```

## Step 5: File Permissions

Ensure the following directories are writable by the web server (usually permissions `755` are fine, but verify if `uploads` needs write access):

- `public/uploads/` (and subdirectories `images`, `thumbnails`, etc.)

If you encounter permission errors when uploading images, check that these folders have write permissions.

## Step 6: Verify Deployment

1.  Visit your domain (e.g., `https://yourdomain.com`).
2.  You should be redirected to the Login page (`/auth`).
3.  **Default Credentials:**
    - Email: `admin@example.com`
    - Password: `admin123`
4.  **Important:** Change the admin password immediately after logging in via the Profile settings.

## Troubleshooting

-   **404 Not Found:** Ensure the `.htaccess` file was uploaded to the `public` directory.
-   **Database Error:** Double-check `.env` credentials and ensure the database user has permissions.
-   **CSS Not Loading:** Ensure `public/css/style.css` exists and is accessible.
