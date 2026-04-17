package com.gymmanagement.usermanagement.Response;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class KeySyncResponse {
    private String publicKey;
    private String encryptedPrivateKey;
}
