<?php
namespace App\Models;

class User extends Model {
    protected string $table = 'profiles';

    public function findByEmail(string $email): ?array
    {
        $stmt = self::getConnection()->prepare(
            "SELECT * FROM {$this->table} WHERE email = ?"
        );
        $stmt->execute([$email]);
        $result = $stmt->fetch();
        return $result ?: null;
    }
}
