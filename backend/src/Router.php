<?php
namespace App;

class Router {
    private array $routes = [];
    private array $middleware = [];

    public function get(string $path, callable|array $handler, array $middleware = []): self
    {
        $this->addRoute('GET', $path, $handler, $middleware);
        return $this;
    }

    public function post(string $path, callable|array $handler, array $middleware = []): self
    {
        $this->addRoute('POST', $path, $handler, $middleware);
        return $this;
    }

    private function addRoute(string $method, string $path, callable|array $handler, array $middleware): void
    {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'middleware' => $middleware,
        ];
    }

    public function dispatch(string $method, string $uri): mixed
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;

            $params = $this->matchRoute($route['path'], $uri);
            if ($params !== null) {
                // Run middleware
                foreach ($route['middleware'] as $mw) {
                    if (!$mw::handle()) {
                        return null; // Middleware handles redirect
                    }
                }

                // Call handler
                if (is_array($route['handler'])) {
                    [$class, $method] = $route['handler'];
                    $controller = new $class();
                    return $controller->$method(...$params);
                }
                return ($route['handler'])(...$params);
            }
        }

        // 404
        http_response_code(404);
        echo "404 Not Found";
        return null;
    }

    private function matchRoute(string $pattern, string $uri): ?array
    {
        $pattern = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $pattern);
        $pattern = '#^' . $pattern . '$#';

        if (preg_match($pattern, $uri, $matches)) {
            return array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
        }
        return null;
    }
}
