<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
         $this->app->singleton(AlertService::class, function ($app) {
            return new AlertService();
        });

        $this->app->singleton(MetricIngestionService::class, function ($app) {
            return new MetricIngestionService($app->make(AlertService::class));
        });

    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
