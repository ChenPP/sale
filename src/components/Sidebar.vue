<template>
  <div>
    <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div class="sidebar-sticky pt-3">
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>管理功能</span>
          <a class="d-flex align-items-center text-muted" href="#" aria-label="Add a new report">
            <span data-feather="plus-circle"></span>
          </a>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard/product">
              <b-icon icon="box-seam" class="mr-1"></b-icon>
              <span class="align-self-center">產品列表</span>
            </router-link>
          </li>
        </ul>
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
          <span>模擬功能</span>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link class="nav-link" to="/about">
              <b-icon icon="bag-check" class="mr-1"></b-icon>
              <span class="align-self-center">訂單功能</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
