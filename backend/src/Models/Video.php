<?php
namespace App\Models;

class Video extends Model {
    protected string $table = 'videos';

    public function paginate(int $page = 1, int $perPage = 10, string $search = ''): array
    {
        $offset = ($page - 1) * $perPage;
        $params = [];
        $where = [];

        $sql = "SELECT v.*, u.full_name as author_name
                FROM videos v
                LEFT JOIN profiles u ON v.author_id = u.id";

        if (!empty($search)) {
            $where[] = "(v.title LIKE ?)";
            $params[] = '%' . $search . '%';
        }

        if (!empty($where)) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }

        // Count total
        $countSql = "SELECT COUNT(*) FROM videos v";
        if (!empty($where)) {
            $countSql .= ' WHERE ' . implode(' AND ', $where);
        }
        $stmt = self::getConnection()->prepare($countSql);
        $stmt->execute($params);
        $total = $stmt->fetchColumn();

        // Fetch data
        $sql .= " ORDER BY v.created_at DESC LIMIT $perPage OFFSET $offset";
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
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
