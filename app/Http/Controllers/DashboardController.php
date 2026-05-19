<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $documents = auth()->user()->documents()->latest()->get();
        return view('dashboard', compact('documents'));
    }
}