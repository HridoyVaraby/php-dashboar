<?php
namespace App\Models;

class SiteSettings extends Model {
    protected string $table = 'site_settings';

    public function getSettings(): array
    {
        // There should be only one row
        $sql = "SELECT * FROM site_settings LIMIT 1";
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute();
        $settings = $stmt->fetch();

        if (!$settings) {
            // Create default settings if not exists
            $id = $this->create([
                'site_name' => 'NewsViewBD',
                'site_description' => 'News Portal',
                'site_url' => 'http://localhost:8000',
            ]);
            return $this->find($id);
        }

        return $settings;
    }
}
