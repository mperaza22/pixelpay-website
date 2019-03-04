<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

$params = ['bg' => rand(1,6), 'output' => 'hello testing :)'];

Route::view('/', 'frontend.home', $params)->name('home');
Route::view('/console', 'console', $params);

Route::view('/faq', 'frontend.faq')->name('faq');
Route::view('/privacity-terms', 'frontend.privacity-terms');

Route::view('/documentation', 'docs.index')->name('docs');
Route::view('/documentation/hpg', 'docs.hpg')->name('docs.hpg');
Route::view('/documentation/webhooks', 'docs.webhooks')->name('docs.webhooks');
Route::view('/documentation/generator', 'docs.generator')->name('docs.generator');
Route::view('/documentation/manual', 'docs.manual')->name('docs.manual');

Route::view('/register', 'console', $params)->name('register');
Route::view('/login', 'console', $params)->name('login');