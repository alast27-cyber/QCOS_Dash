#include <iostream>
#include <chrono>
#include <vector>
#include <numeric>
#include <fstream>
#include <cmath>
#include <string>
#include <random>

// Simple circular buffer to track V-Score history for Semantic Drift
std::vector<float> v_score_history;
const int MAX_HISTORY = 50;

// 1. Entropy Sensor: Measures system randomness
// On Windows, we simulate this using the hardware random device availability
int get_entropy_availability() {
    std::random_device rd;
    // Returns a simulated entropy bits value based on device entropy
    return (rd.entropy() > 0) ? 2048 : 256; 
}

// 2. I/O Latency "Heartbeat": Measures disk response time in ms
double get_io_latency() {
    auto start = std::chrono::high_resolution_clock::now();
    
    // Perform a tiny atomic write/delete operation
    std::ofstream heartbeat("qcos_heartbeat.tmp");
    if (heartbeat.is_open()) {
        heartbeat << "pulse";
        heartbeat.close();
        std::remove("qcos_heartbeat.tmp");
    }
    
    auto end = std::chrono::high_resolution_clock::now();
    std::chrono::duration<double, std::milli> elapsed = end - start;
    return elapsed.count();
}

// 3. Semantic Drift: Measures the standard deviation of V-Score stability
float calculate_semantic_drift(float current_v) {
    v_score_history.push_back(current_v);
    if (v_score_history.size() > MAX_HISTORY) {
        v_score_history.erase(v_score_history.begin());
    }
    if (v_score_history.size() < 2) return 0.0f;

    float sum = std::accumulate(v_score_history.begin(), v_score_history.end(), 0.0f);
    float mean = sum / v_score_history.size();
    float sq_sum = 0;
    for (float v : v_score_history) sq_sum += (v - mean) * (v - mean);
    
    return std::sqrt(sq_sum / v_score_history.size());
}

int main() {
    // Generate simulated primary V-Score
    float v_score = 0.75f + (static_cast<float>(rand()) / (static_cast<float>(RAND_MAX/0.2f)));
    
    // Collect new sensor data
    int entropy = get_entropy_availability();
    double io_latency = get_io_latency();
    float drift = calculate_semantic_drift(v_score);
    std::string policy = (v_score > 0.85) ? "ACT_OPTIMIZE" : "HEURISTIC_SEARCH";

    // Output unified JSON for the Python Bridge
    std::cout << "{"
              << "\"v_score\": " << v_score << ","
              << "\"entropy\": " << entropy << ","
              << "\"io_latency\": " << io_latency << ","
              << "\"semantic_drift\": " << drift << ","
              << "\"policy\": \"" << policy << "\""
              << "}" << std::endl;

    return 0;
}