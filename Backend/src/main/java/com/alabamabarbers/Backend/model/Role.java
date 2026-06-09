package com.alabamabarbers.Backend.model;

public enum Role {
    ADMIN("admin"),
    PROFISSIONAL("profissional"),
    CLIENTE("cliente");

    private String role;

    Role(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

}
