package org.apereo.cas.configuration.model.support.passwordless.token;

import org.apereo.cas.configuration.model.support.jpa.AbstractJpaProperties;
import org.apereo.cas.configuration.model.support.mongo.SingleCollectionMongoDbProperties;
import org.apereo.cas.configuration.model.support.quartz.ScheduledJobProperties;
import org.apereo.cas.configuration.support.RequiresModule;

import com.fasterxml.jackson.annotation.JsonFilter;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

import java.io.Serial;

/**
 * This is {@link PasswordlessAuthenticationMongoDbTokensProperties}.
 *
 * @author Misagh Moayyed
 * @since 6.2.0
 */
@RequiresModule(name = "cas-server-support-passwordless-mongo")
@Getter
@Setter
@Accessors(chain = true)
@JsonFilter("PasswordlessAuthenticationMongoDbTokensProperties")
public class PasswordlessAuthenticationMongoDbTokensProperties extends SingleCollectionMongoDbProperties {

    @Serial
    private static final long serialVersionUID = 4347381223153797806L;

}
