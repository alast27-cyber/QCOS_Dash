cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(qcos_inference_engine)

# Replace the path below with your actual LibTorch location
set(CMAKE_PREFIX_PATH "C:/Libtorch/libtorch") 

find_package(Torch REQUIRED)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${TORCH_CXX_FLAGS}")

add_executable(qcos_inference qcos_inference_stub.cpp)

target_link_libraries(qcos_inference "${TORCH_LIBRARIES}")
set_property(TARGET qcos_inference PROPERTY CXX_STANDARD 17)