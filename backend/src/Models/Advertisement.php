<?php
namespace App\Models;

class Advertisement extends Model {
    protected string $table = 'advertisements';

    public function paginate(int $page = 1, int $perPage = 10): array
    {
        $offset = ($page - 1) * $perPage;

        $total = $this->count();

        $sql = "SELECT * FROM advertisements ORDER BY created_at DESC LIMIT $perPage OFFSET $offset";
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute();
        $data = $stmt->fetchAll();

        return [
            'data' => $data,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage),
        ];
    }
}
